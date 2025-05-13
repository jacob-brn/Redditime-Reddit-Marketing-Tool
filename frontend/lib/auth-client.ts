import { createAuthClient } from "better-auth/react";
import { nextCookies } from "better-auth/next-js";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  plugins: [nextCookies()],
});

export const signInWithReddit = async () => {
  await authClient.signIn.social({
    provider: "reddit",
    callbackURL: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/`,
  });
};

export const { signIn, signOut, signUp, useSession } = authClient;
