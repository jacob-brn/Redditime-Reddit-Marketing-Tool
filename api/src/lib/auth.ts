import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "../db/index.ts";
import { env } from "./env.ts";
import { extractParentDomain } from "./extract-parent-domain.ts";

export const auth = betterAuth({
  advanced: {
    ...(() => {
      const parentDomain = extractParentDomain(env.NEXT_PUBLIC_APP_URL);
      if (parentDomain) {
        return {
          crossSubDomainCookies: {
            enabled: true,
            domain: parentDomain,
          },
        };
      }
      return {};
    })(),
  },
  defaultCookieAttributes: {
    secure: true,
    httpOnly: true,
    sameSite: "none",
    partitioned: true,
  },
  trustedOrigins: [env.NEXT_PUBLIC_APP_URL],
  socialProviders: {
    reddit: {
      clientId: env.REDDIT_CLIENT_ID,
      clientSecret: env.REDDIT_CLIENT_SECRET,
      duration: "permanent",
      scope: ["identity", "read", "submit"],
    },
  },
  database: drizzleAdapter(db, {
    provider: "sqlite",
  }),
});
