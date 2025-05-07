import cron from "node-cron";
import trackKeywords from "./track-keywords.js";
import postScheduledPosts from "./post-scheduled-posts.js";

// Schedule the keyword tracking job to run every 15 minutes
cron.schedule("*/15 * * * *", async () => {
  console.log("Running keyword tracking job...");
  await trackKeywords();
  console.log("Keyword tracking job completed.");
});

// Schedule the scheduled posts job to run every 15 minutes
cron.schedule("*/15 * * * *", async () => {
  console.log("Running scheduled posts job...");
  await postScheduledPosts();
  console.log("Scheduled posts job completed.");
});

console.log("Cron jobs scheduled successfully.");
