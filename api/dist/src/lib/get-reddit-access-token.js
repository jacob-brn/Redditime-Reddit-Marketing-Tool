import { db } from "../db/index.js";
import { account } from "../db/schema.js";
import { eq } from "drizzle-orm";
import { env } from "./env.js";
const REDDIT_CLIENT_ID = env.REDDIT_CLIENT_ID;
const REDDIT_CLIENT_SECRET = env.REDDIT_CLIENT_SECRET;
export default async function getRedditAccessToken(userId) {
    const [acct] = await db
        .select()
        .from(account)
        .where(eq(account.userId, userId));
    if (!acct || acct.providerId !== "reddit")
        return null;
    const now = Date.now();
    const tokenStillValid = acct.accessToken &&
        acct.accessTokenExpiresAt &&
        now < acct.accessTokenExpiresAt.getTime();
    if (tokenStillValid) {
        return acct.accessToken;
    }
    if (!acct.refreshToken)
        return null;
    // OAuth2 refresh request
    const basicAuth = Buffer.from(`${REDDIT_CLIENT_ID}:${REDDIT_CLIENT_SECRET}`).toString("base64");
    const res = await fetch("https://www.reddit.com/api/v1/access_token", {
        method: "POST",
        headers: {
            Authorization: `Basic ${basicAuth}`,
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
            grant_type: "refresh_token",
            refresh_token: acct.refreshToken,
        }),
    });
    if (!res.ok) {
        console.error("Reddit OAuth2 refresh failed:", await res.text());
        return null;
    }
    const data = await res.json();
    await db
        .update(account)
        .set({
        accessToken: data.access_token,
        accessTokenExpiresAt: new Date(Date.now() + data.expires_in * 1000),
        updatedAt: new Date(),
    })
        .where(eq(account.id, acct.id));
    return data.access_token;
}
