import { Hono } from "hono";
import { auth } from "../lib/auth.js";
import { db } from "../db/index.js";
import { user } from "../db/schema.js";
import { eq } from "drizzle-orm";
const app = new Hono();
app.post("/update-email", async (c) => {
    const session = c.get("session");
    if (!session || !session.token)
        return c.json({ error: "Unauthorized", message: null }, 401);
    const body = await c.req.json();
    const email = body.email;
    if (!email)
        return c.json({ error: "Missing email", message: null }, 400);
    const updateEmail = db
        .update(user)
        .set({ email: email })
        .where(eq(user.id, session.userId))
        .run();
    if (updateEmail.changes === 0)
        return c.json({ error: "Error updating email", message: null }, 400);
    return c.json({ message: "Email updated successfully", error: null }, 200);
});
app.on(["POST", "GET"], "/*", (c) => {
    return auth.handler(c.req.raw);
});
export default app;
