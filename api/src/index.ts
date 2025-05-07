import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { auth } from "./lib/auth.js";
import redditRoute from "./routes/reddit.ts";
import authRoute from "./routes/auth.ts";
import { cors } from "hono/cors";
import { env } from "./lib/env.js";

const app = new Hono<{
  Variables: {
    user: typeof auth.$Infer.Session.user | null;
    session: typeof auth.$Infer.Session.session | null;
  };
}>();

app.use(
  "/*",
  cors({
    origin: [env.NEXT_PUBLIC_APP_URL],
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["POST", "GET", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
    credentials: true,
  })
);

app.use("*", async (c, next) => {
  const session = await auth.api.getSession({ headers: c.req.raw.headers });

  if (!session) {
    c.set("user", null);
    c.set("session", null);
    return next();
  }

  c.set("user", session.user);
  c.set("session", session.session);
  return next();
});

app.route("/api/auth", authRoute);
app.route("/api/reddit", redditRoute);

const port = 8080;
console.log(`Server is running on http://localhost:${port}`);

// Start the API server
serve({
  fetch: app.fetch,
  port,
});
