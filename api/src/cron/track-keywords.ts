import { db } from "../db/index.js";
import { subscription, seenPost, user } from "../db/schema.js";
import { eq, inArray } from "drizzle-orm";
import axios from "axios";
import { env } from "../lib/env.js";
import { nanoid } from "nanoid";
import { Resend } from "resend";
import EmailTemplate from "../emails/tracked-keyword-found.js";

// Reddit API base URL
const REDDIT_API_BASE = "https://oauth.reddit.com";
const SEARCH_LIMIT = 10;
const TOKEN_CACHE_TTL = 3600; // 1 hour in seconds

// Cache for access token
let tokenCache: { token: string; expiresAt: number } | null = null;

// Initialize Resend
const resend = new Resend(env.RESEND_API_KEY);

// Function to get application-only access token with caching
export async function getAppAccessToken() {
  const now = Math.floor(Date.now() / 1000);

  // Return cached token if it's still valid
  if (tokenCache && tokenCache.expiresAt > now) {
    return tokenCache.token;
  }

  const basicAuth = Buffer.from(
    `${env.REDDIT_CLIENT_ID}:${env.REDDIT_CLIENT_SECRET}`
  ).toString("base64");

  try {
    console.log("Requesting new Reddit access token...");
    const response = await axios.post(
      "https://www.reddit.com/api/v1/access_token",
      new URLSearchParams({
        grant_type: "client_credentials",
      }),
      {
        headers: {
          Authorization: `Basic ${basicAuth}`,
          "Content-Type": "application/x-www-form-urlencoded",
          "User-Agent": env.REDDIT_USER_AGENT,
        },
      }
    );

    console.log("Successfully obtained new access token");
    // Cache the new token
    tokenCache = {
      token: response.data.access_token,
      expiresAt: now + TOKEN_CACHE_TTL,
    };

    return response.data.access_token;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Error getting access token:", {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      });
    } else {
      console.error("Error getting access token:", error);
    }
    throw error;
  }
}

// Function to check multiple keywords in a subreddit
async function checkSubreddit(
  subreddit: string,
  keywords: string[],
  accessToken: string
) {
  try {
    // Validate subreddit name
    const cleanSubreddit = subreddit.replace(/^r\//, "").trim();
    if (!cleanSubreddit) {
      console.error(`Invalid subreddit name: ${subreddit}`);
      return;
    }

    // Validate keywords
    const cleanKeywords = keywords
      .map((k) => k.trim())
      .filter((k) => k.length > 0);

    if (cleanKeywords.length === 0) {
      console.error(`No valid keywords for subreddit: ${cleanSubreddit}`);
      return;
    }

    const redditApi = axios.create({
      baseURL: REDDIT_API_BASE,
      headers: {
        "User-Agent": env.REDDIT_USER_AGENT,
        Authorization: `Bearer ${accessToken}`,
      },
    });

    // Get all post IDs we've already seen for this subreddit
    const seenPostIds = await db.query.seenPost.findMany({
      where: eq(seenPost.subreddit, cleanSubreddit),
      columns: { postId: true },
    });
    const seenPostIdSet = new Set(seenPostIds.map((p) => p.postId));

    // Get all subscriptions for these keywords
    const subscriptions = await db.query.subscription.findMany({
      where: inArray(subscription.keyword, cleanKeywords),
    });
    const keywordToSubscription = new Map(
      subscriptions.map((sub) => [sub.keyword, sub])
    );

    // Build search query
    const searchQuery = cleanKeywords
      .map((k) => `"${k}"`) // Quote each keyword to match exact phrases
      .join(" OR ");

    // Search for posts in the last 15 minutes
    console.log(
      `Searching r/${cleanSubreddit} for keywords: ${cleanKeywords.join(", ")}`
    );
    console.log(`Search query: ${searchQuery}`);

    const response = await redditApi
      .get(`/r/${cleanSubreddit}/search`, {
        params: {
          q: searchQuery,
          sort: "new",
          t: "hour",
          limit: SEARCH_LIMIT,
          restrict_sr: "on",
        },
      })
      .catch((error) => {
        if (axios.isAxiosError(error)) {
          console.error(`Reddit API error for r/${cleanSubreddit}:`, {
            status: error.response?.status,
            data: error.response?.data,
            message: error.message,
            url: error.config?.url,
            params: error.config?.params,
          });
        } else {
          console.error(`Error searching r/${cleanSubreddit}:`, error);
        }
        throw error;
      });

    const posts = response.data.data.children;
    console.log(`Found ${posts.length} posts in r/${cleanSubreddit}`);

    const newPosts = [];

    for (const post of posts) {
      const postData = post.data;

      // Skip if we've already seen this post
      if (seenPostIdSet.has(postData.id)) continue;

      // Check which keywords match this post
      const matchingKeywords = cleanKeywords.filter(
        (keyword) =>
          postData.title.toLowerCase().includes(keyword.toLowerCase()) ||
          postData.selftext?.toLowerCase().includes(keyword.toLowerCase())
      );

      if (matchingKeywords.length > 0) {
        newPosts.push({
          postData,
          matchingKeywords,
        });
      }
    }

    // Batch insert all new posts
    if (newPosts.length > 0) {
      const seenPostsToInsert = newPosts
        .flatMap(({ postData, matchingKeywords }) =>
          matchingKeywords.map((keyword) => {
            const sub = keywordToSubscription.get(keyword);
            if (!sub) return null;

            return {
              id: nanoid(),
              postId: postData.id,
              subreddit: cleanSubreddit,
              matchedKeyword: keyword,
              matchedAt: new Date(),
              userId: sub.userId,
              subscriptionId: sub.id,
            };
          })
        )
        .filter((post): post is NonNullable<typeof post> => post !== null);

      if (seenPostsToInsert.length > 0) {
        await db.insert(seenPost).values(seenPostsToInsert);

        // Group posts by user to send one email per user
        const postsByUser = new Map<string, typeof newPosts>();
        for (const { postData, matchingKeywords } of newPosts) {
          matchingKeywords.forEach((keyword) => {
            const sub = keywordToSubscription.get(keyword);
            if (!sub) return;

            const userPosts = postsByUser.get(sub.userId) || [];
            userPosts.push({ postData, matchingKeywords: [keyword] });
            postsByUser.set(sub.userId, userPosts);
          });
        }

        // Send emails to each user
        for (const [userId, userPosts] of postsByUser) {
          // Fetch user email
          const userData = await db.query.user.findFirst({
            where: eq(user.id, userId),
            columns: {
              email: true,
            },
          });

          if (!userData?.email) {
            console.error(`No email found for user ${userId}`);
            continue;
          }

          console.log(
            `Attempting to send email to ${userData.email} for keyword "${userPosts[0].matchingKeywords[0]}"`
          );

          try {
            // Prepare posts with icons
            const postsWithIcons = await Promise.all(
              userPosts.map(async ({ postData, matchingKeywords }) => ({
                postId: postData.id,
                subreddit: cleanSubreddit,
                matchedKeyword: matchingKeywords[0],
                subredditIconUrl: await getSubredditIcon(cleanSubreddit),
              }))
            );

            const emailResponse = await resend.emails.send({
              from: `Redditime <${env.EMAIL_FROM}>`,
              to: userData.email,
              subject: `New Reddit posts found for "${userPosts[0].matchingKeywords[0]}"`,
              react: EmailTemplate({
                posts: postsWithIcons,
                keyword: userPosts[0].matchingKeywords[0],
              }),
            });

            console.log("Email response:", emailResponse);
            console.log(`Email sent successfully to ${userData.email}`);
          } catch (error) {
            console.error(`Failed to send email to ${userData.email}:`, error);
            if (error instanceof Error) {
              console.error("Error details:", {
                message: error.message,
                stack: error.stack,
                name: error.name,
              });
            }
          }
        }

        // Log matches
        for (const { postData, matchingKeywords } of newPosts) {
          console.log(
            `Found new post in r/${cleanSubreddit} matching keywords "${matchingKeywords.join(", ")}": ${postData.title}`
          );
        }
      }
    }
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 429) {
      console.error(
        `Rate limit exceeded for r/${subreddit}, waiting before retry...`
      );
      // TODO: Implement proper rate limiting with exponential backoff
      await new Promise((resolve) => setTimeout(resolve, 60000)); // Wait 1 minute
    } else {
      console.error(`Error checking subreddit r/${subreddit}:`, error); // Fixed: Using subreddit instead of cleanSubreddit
    }
  }
}

export async function trackKeywords() {
  try {
    // Get all active subscriptions
    const subscriptions = await db.query.subscription.findMany();

    // Group subscriptions by subreddit
    const subredditToKeywords = new Map<string, string[]>();
    for (const sub of subscriptions) {
      const keywords = subredditToKeywords.get(sub.subreddit) || [];
      keywords.push(sub.keyword);
      subredditToKeywords.set(sub.subreddit, keywords);
    }

    // Get access token once for all requests
    const accessToken = await getAppAccessToken();

    // Process each subreddit
    for (const [subreddit, keywords] of subredditToKeywords) {
      await checkSubreddit(subreddit, keywords, accessToken);
    }
  } catch (error) {
    console.error("Error in trackKeywords cron job:", error);
  }
}

// Export the function to be used by the cron scheduler
export default trackKeywords;

async function getSubredditIcon(
  subreddit: string
): Promise<string | undefined> {
  const url = `https://www.reddit.com/r/${subreddit}/about.json`;
  try {
    const res = await axios.get(url, {
      headers: { "User-Agent": "merketing-tool/0.1" },
    });
    const data = res.data;
    return data.data.icon_img || data.data.community_icon || undefined;
  } catch {
    return undefined;
  }
}
