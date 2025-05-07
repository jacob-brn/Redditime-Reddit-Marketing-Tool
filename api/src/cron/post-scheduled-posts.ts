import { db } from "../db/index.js";
import { scheduledPost } from "../db/schema.js";
import { and, eq, lte } from "drizzle-orm";
import getRedditAccessToken from "../lib/get-reddit-access-token.js";
import axios from "axios";
import { env } from "../lib/env.ts";

async function submitPostToReddit(
  accessToken: string,
  title: string,
  content: string,
  subreddit: string
) {
  try {
    // Remove 'r/' prefix if it exists
    const cleanSubreddit = subreddit.replace(/^r\//, "");

    console.log(cleanSubreddit);
    const response = await axios.post(
      "https://oauth.reddit.com/api/submit",
      new URLSearchParams({
        kind: "self",
        title: title,
        text: content,
        sr: cleanSubreddit,
        api_type: "json",
      }).toString(),
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "User-Agent": env.REDDIT_USER_AGENT,
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    // Log the full response for debugging
    console.log("Reddit API Response:", JSON.stringify(response.data, null, 2));

    // Check if response has the expected structure
    if (!response.data || typeof response.data !== "object") {
      throw new Error("Invalid response from Reddit API");
    }

    // Handle different possible error structures
    if (response.data.error) {
      throw new Error(`Reddit API Error: ${response.data.error}`);
    }

    if (response.data.json?.errors?.length > 0) {
      throw new Error(response.data.json.errors[0][1]);
    }

    // Check for jQuery error messages in the response
    if (response.data.jquery) {
      const errorMessages = response.data.jquery
        .filter(
          (item: any) =>
            Array.isArray(item) &&
            item.length >= 4 &&
            item[2] === "call" &&
            item[3]?.[0]?.includes("error")
        )
        .map((item: any) => item[3]?.[0])
        .filter(Boolean);

      if (errorMessages.length > 0) {
        throw new Error(`Reddit API Error: ${errorMessages[0]}`);
      }
    }

    // Check if we have the required data
    if (!response.data.json?.data?.id || !response.data.json?.data?.url) {
      throw new Error(
        "Failed to create post: Invalid response from Reddit API"
      );
    }

    return {
      success: true,
      postId: response.data.json.data.id,
      url: `https://reddit.com${response.data.json.data.url}`,
    };
  } catch (error) {
    console.error("Error submitting post to Reddit:", error);
    if (axios.isAxiosError(error)) {
      console.error("Axios error details:", {
        status: error.response?.status,
        data: error.response?.data,
        headers: error.response?.headers,
      });
    }
    throw error;
  }
}

export default async function postScheduledPosts() {
  console.log("Checking for scheduled posts to publish...");

  try {
    // Get all pending posts that are due
    const duePosts = await db
      .select()
      .from(scheduledPost)
      .where(
        and(
          eq(scheduledPost.status, "pending"),
          lte(scheduledPost.scheduledFor, new Date())
        )
      );

    console.log(`Found ${duePosts.length} posts to publish`);

    for (const post of duePosts) {
      try {
        // Get user's Reddit access token
        const accessToken = await getRedditAccessToken(post.userId);
        if (!accessToken) {
          throw new Error("Failed to get Reddit access token");
        }

        // Submit the post to Reddit
        const result = await submitPostToReddit(
          accessToken,
          post.title,
          post.content,
          post.subreddit
        );

        console.log(result);
        // Update post status to posted
        await db
          .update(scheduledPost)
          .set({
            status: "posted",
            updatedAt: new Date(),
          })
          .where(eq(scheduledPost.id, post.id));

        console.log(`Successfully posted: ${post.title} (${result.url})`);
      } catch (error) {
        console.error(`Failed to post: ${post.title}`, error);

        // Update post status to failed
        await db
          .update(scheduledPost)
          .set({
            status: "failed",
            errorMessage:
              error instanceof Error ? error.message : "Unknown error",
            updatedAt: new Date(),
          })
          .where(eq(scheduledPost.id, post.id));
      }
    }
  } catch (error) {
    console.error("Error in postScheduledPosts cron job:", error);
  }
}
