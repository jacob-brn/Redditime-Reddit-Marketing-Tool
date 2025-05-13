import { Hono } from "hono";
import type { auth } from "../lib/auth.ts";
import axios from "axios";
import getRedditAccessToken from "../lib/get-reddit-access-token.ts";
import { db } from "../db/index.ts";
import { subscription, seenPost, scheduledPost } from "../db/schema.ts";
import { nanoid } from "nanoid";
import { and, eq } from "drizzle-orm";
import { z } from "zod";
import { env } from "../lib/env.ts";

const app = new Hono<{
  Variables: {
    user: typeof auth.$Infer.Session.user | null;
    session: typeof auth.$Infer.Session.session | null;
  };
}>();

export const createScheduledPostSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Content is required"),
  subreddit: z.string().min(1, "Subreddit is required"),
  scheduledFor: z
    .string()
    .refine(
      (val) => {
        const date = new Date(val);
        if (isNaN(date.getTime())) return false;
        const minutes = date.getMinutes();
        return [0, 15, 30, 45].includes(minutes);
      },
      {
        message:
          "Scheduled time must be at 00, 15, 30, or 45 minutes past the hour and a valid date string",
      }
    )
    .transform((val) => new Date(val)),
});

app.post("/schedule-post", async (c) => {
  const user = c.get("user");
  const session = c.get("session");

  if (!user?.id) return c.json({ error: "Unauthorized" }, 401);
  if (!session?.token) return c.json({ error: "Unauthorized" }, 401);

  const body = await c.req.json();
  const result = createScheduledPostSchema.safeParse(body);

  if (!result.success) {
    return c.json({ error: "Invalid request body" }, 400);
  }

  const [post] = await db
    .insert(scheduledPost)
    .values({
      id: nanoid(),
      userId: user.id,
      title: result.data.title,
      content: result.data.content,
      subreddit: result.data.subreddit,
      scheduledFor: result.data.scheduledFor,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    .returning({
      id: scheduledPost.id,
      title: scheduledPost.title,
      subreddit: scheduledPost.subreddit,
      scheduledFor: scheduledPost.scheduledFor,
      status: scheduledPost.status,
    });

  return c.json(post);
});

app.get("/scheduled-posts", async (c) => {
  const user = c.get("user");
  if (!user?.id) return c.json({ error: "Unauthorized" }, 401);

  try {
    const posts = await db
      .select({
        id: scheduledPost.id,
        title: scheduledPost.title,
        subreddit: scheduledPost.subreddit,
        scheduledFor: scheduledPost.scheduledFor,
        status: scheduledPost.status,
      })
      .from(scheduledPost)
      .where(eq(scheduledPost.userId, user.id))
      .orderBy(scheduledPost.scheduledFor);

    const formattedPosts = posts.map((post) => ({
      ...post,
      scheduledFor: new Date(post.scheduledFor).toISOString(),
    }));

    return c.json({
      success: true,
      data: formattedPosts,
      count: formattedPosts.length,
    });
  } catch (error) {
    console.error("Error fetching scheduled posts:", error);
    return c.json(
      {
        success: false,
        error: "Failed to fetch scheduled posts",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      500
    );
  }
});

app.get("/scheduled-posts/:id", async (c) => {
  const user = c.get("user");
  if (!user?.id) return c.json({ error: "Unauthorized" }, 401);

  const id = c.req.param("id");
  const post = await db
    .select()
    .from(scheduledPost)
    .where(eq(scheduledPost.id, id))
    .then((posts) => posts[0]);

  if (!post) {
    return c.json({ error: "Post not found" }, 404);
  }

  if (post.userId !== user.id) {
    return c.json({ error: "Forbidden" }, 403);
  }

  return c.json(post);
});

app.delete("/scheduled-posts/:id", async (c) => {
  const user = c.get("user");
  if (!user?.id) return c.json({ error: "Unauthorized" }, 401);

  const id = c.req.param("id");
  const post = await db
    .select()
    .from(scheduledPost)
    .where(eq(scheduledPost.id, id))
    .then((posts) => posts[0]);

  if (!post) {
    return c.json({ error: "Post not found" }, 404);
  }

  if (post.userId !== user.id) {
    return c.json({ error: "Forbidden" }, 403);
  }

  await db.delete(scheduledPost).where(eq(scheduledPost.id, id));
  return c.json({ success: true });
});

app.post("/delete-keyword", async (c) => {
  const user = c.get("user");
  const session = c.get("session");

  if (!user?.id) return c.json({ error: "Unauthorized" }, 401);
  if (!session?.token) return c.json({ error: "Unauthorized" }, 401);

  const { keywordId } = await c.req.json();

  if (!keywordId) return c.json({ error: "Missing keyword ID" }, 400);

  await db
    .delete(seenPost)
    .where(
      and(eq(seenPost.subscriptionId, keywordId), eq(seenPost.userId, user.id))
    );

  const dbResponse = await db
    .delete(subscription)
    .where(
      and(eq(subscription.id, keywordId), eq(subscription.userId, user.id))
    );

  if (dbResponse.changes < 1)
    return c.json({ error: "Failed to delete keyword" }, 500);

  return c.json({ message: "Keyword deleted successfully" }, 200);
});

app.get("/my-tracked-keywords", async (c) => {
  const user = c.get("user");
  if (!user?.id) return c.json({ error: "Unauthorized" }, 401);

  const myKeywords = await db
    .select({
      id: subscription.id,
      keyword: subscription.keyword,
      subreddit: subscription.subreddit,
      iconUrl: subscription.iconUrl,
    })
    .from(subscription)
    .where(eq(subscription.userId, user.id));

  if (myKeywords.length < 1) return c.json({ error: "No keywords found" }, 404);

  return c.json({ subscriptions: myKeywords });
});

app.get("/test", async (c) => {
  const redditInfo = await axios.get(
    `https://www.reddit.com/r/indiehackers/about.json`,
    {
      headers: {
        Authorization: `Basic ${Buffer.from(
          `${env.REDDIT_CLIENT_ID}:${env.REDDIT_CLIENT_SECRET}`
        ).toString("base64")}`,
        "User-Agent": `${env.REDDIT_USER_AGENT}`,
        Accept: "application/json",
      },
    }
  );

  return c.json(redditInfo.data);
});

app.post("/add-keyword", async (c) => {
  const session = c.get("session");
  const user = c.get("user");
  const { keyword, subreddit } = await c.req.json();

  if (!session || !session.token) return c.json({ error: "Unauthorized" }, 401);
  if (!user?.id) return c.json({ error: "User ID not found" }, 401);

  if (!keyword || !subreddit)
    return c.json({ error: "Missing keyword or subreddit" }, 400);

  const redditInfo = await axios.get(
    `https://www.reddit.com/r/${subreddit.replace("r/", "")}/about.json`,
    {
      headers: {
        "User-Agent": `${env.REDDIT_USER_AGENT}`,
        Accept: "application/json",
      },
    }
  );

  console.log(redditInfo);

  console.log(redditInfo.data);

  console.log(redditInfo.config);
  const icon =
    redditInfo.data?.data?.icon_img ||
    redditInfo.data?.data?.community_icon ||
    null;

  try {
    const dbResponse = await db.insert(subscription).values({
      id: nanoid(),
      userId: user.id,
      keyword,
      subreddit,
      iconUrl: icon ? icon.split("?")[0] : null,
      createdAt: new Date(),
    });

    if (dbResponse.changes < 1)
      return c.json({ error: "Failed to add keyword" }, 500);

    return c.json({ message: "Keyword added successfully", error: null }, 200);
  } catch (error) {
    console.error("Error adding keyword:", error);
    return c.json({ error: "Failed to add keyword" }, 500);
  }
});

app.get("/search-subreddits", async (c) => {
  const session = c.get("session");
  const user = c.get("user");
  const query = c.req.query("q");

  if (!session || !session.token) return c.json({ error: "Unauthorized" }, 401);

  if (!query) return c.json({ error: "Missing search query" }, 400);

  if (!user?.id) return c.json({ error: "User ID not found" }, 401);

  const accessToken = await getRedditAccessToken(user.id);

  if (!accessToken) {
    return c.json(
      {
        error: "Failed to retrieve Reddit access token after multiple attempts",
      },
      401
    );
  }

  try {
    const redditRes = await axios.get<{
      data: {
        children: Array<{
          data: {
            id: string;
            display_name: string;
            title: string;
            public_description: string;
            subscribers: number;
            url: string;
            over18: boolean;
            icon_img?: string;
            community_icon?: string;
            created_utc: number;
          };
        }>;
      };
    }>(`https://oauth.reddit.com/subreddits/search`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "User-Agent": env.REDDIT_USER_AGENT,
      },
      params: {
        q: query,
        limit: 3,
        include_over_18: false,
        include_unadvertisable: false,
        sort: "relevance",
        exact: true,
      },
    });

    const subreddits = redditRes.data.data.children.map((child) => {
      const sub = child.data;

      if (!sub.over18) {
        return {
          name: sub.display_name,
          url: `https://www.reddit.com${sub.url}`,
          icon: sub.icon_img || sub.community_icon,
        };
      }
    });

    return c.json({ subreddits });
  } catch (error: unknown) {
    console.error(
      "Reddit API error:",
      error instanceof Error ? error.message : String(error)
    );

    if (axios.isAxiosError(error) && error.response) {
      return c.json(
        {
          error: "Failed to fetch subreddits from Reddit",
          details: error.response.data,
        },
        500
      );
    }

    return c.json(
      {
        error: "Failed to fetch subreddits from Reddit",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      500
    );
  }
});

app.post("/scheduled-posts/delete", async (c) => {
  const user = c.get("user");
  if (!user?.id) return c.json({ error: "Unauthorized" }, 401);

  const { id } = await c.req.json();
  if (!id) return c.json({ error: "Missing post ID" }, 400);

  const post = await db
    .select()
    .from(scheduledPost)
    .where(eq(scheduledPost.id, id))
    .then((posts) => posts[0]);

  if (!post) {
    return c.json({ error: "Post not found" }, 404);
  }

  if (post.userId !== user.id) {
    return c.json({ error: "Forbidden" }, 403);
  }

  await db.delete(scheduledPost).where(eq(scheduledPost.id, id));
  return c.json({ success: true });
});

export default app;
