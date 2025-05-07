import FeatureCard from "@/components/FeatureCard";
import Navbar from "@/components/Navbar";
import { Radar } from "@/components/Radar";
import RedditLogoPill from "@/components/RedditLogoPill";
import { SchedulePostFeature } from "@/components/SchedulePostFeature";
import { Button } from "@/components/ui/button";
import siteConfig from "@/config/config";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { FaGithub } from "react-icons/fa6";

export default function Home() {
  return (
    <div className="relative max-w-7xl mx-auto w-full border-x">
      <Navbar />
      <main className="relative w-full py-24 px-4 border-b grid gap-y-4 lg:gap-y-6 [box-shadow:0px_0px_35px_-30px_var(--foreground)_inset]">
        <h1 className="max-w-6xl w-full mx-auto text-center text-balance tracking-tight font-bold text-4xl md:text-5xl lg:text-6xl xl:text-6xl">
          Grow your product on{" "}
          <span className="text-primary">
            Reddit <RedditLogoPill />
          </span>{" "}
          while you
          <span className="text-primary"> sleep</span>
        </h1>
        <h2 className="max-w-2xl w-full mx-auto text-center text-balance text-muted-foreground text-base md:text-xl font-medium tracking-tight">
          Analyze subreddit activity to identify the best posting times and
          schedule your posts for maximum reach.
        </h2>
        <div className="w-full mx-auto px-4 flex justify-center flex-col md:flex-row gap-4">
          <Link href={"/login"}>
            <Button
              size={"lg"}
              className="w-full bg-gradient-to-b from-primary to-primary/70 [box-shadow:0px_0px_12px_-1px_var(--background)_inset] gap-0.5 group"
            >
              Get Started
              <ArrowRight className="size-4 group-hover:-rotate-45 transition-transform duration-300" />
            </Button>
          </Link>
          <Link href={siteConfig.githubRepoUrl}>
            <Button
              size={"lg"}
              variant={"outline"}
              className="w-full [box-shadow:0px_0px_8px_-5px_var(--foreground)_inset]"
            >
              <FaGithub />
              Source Code
            </Button>
          </Link>
        </div>
        <div className="absolute inset-0 bg-background -z-1 hidden md:block">
          <div className="absolute inset-0 opacity-[0.2] dark:opacity-[0.15]">
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
              <circle
                cx="50%"
                cy="50%"
                r="10%"
                fill="none"
                strokeWidth="1"
                className="stroke-primary/40"
              />
              <circle
                cx="50%"
                cy="50%"
                r="20%"
                fill="none"
                strokeWidth="1"
                className="stroke-primary/40"
              />
              <circle
                cx="50%"
                cy="50%"
                r="30%"
                fill="none"
                strokeWidth="1.5"
                className="stroke-primary/40"
              />
              <circle
                cx="50%"
                cy="50%"
                r="40%"
                fill="none"
                strokeWidth="2"
                className="stroke-primary/50"
              />
              <circle
                cx="50%"
                cy="50%"
                r="50%"
                fill="none"
                strokeWidth="2"
                className="stroke-primary/60"
              />
              <circle
                cx="50%"
                cy="50%"
                r="50%"
                fill="none"
                strokeWidth="2"
                className="stroke-primary/70"
              />
            </svg>
          </div>
        </div>
      </main>
      <div className="w-full h-14 text-border bg-[size:15px_15px] [background-image:repeating-linear-gradient(315deg,currentColor_0_1px,#0000_0_50%)]" />
      <section className="relative max-w-7xl w-full border-t border-b grid">
        <div className="max-w-6xl mx-auto py-12 px-4 md:border-x border-b w-full grid items-center justify-center gap-4 [box-shadow:0px_0px_35px_-30px_var(--foreground)_inset]">
          <h3 className="text-4xl font-semibold tracking-tight text-center">
            What do you get?
          </h3>
          <h4 className="text-base text-muted-foreground font-medium text-center text-balance">
            Features that make marketing on reddit easy
          </h4>
        </div>
        <div className="max-w-6xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 overflow-hidden divide-x divide-y border-b md:border-x">
          <FeatureCard
            title="Analyze subreddit to find specific keywords"
            description="Find the best posts to reply to automatically"
            fadeOnBottom
            fadeOnTop
          >
            <Radar />
          </FeatureCard>
          <FeatureCard
            title="Schedule your posts"
            description="Schedule your posts to maximize reach and engagement."
          >
            <SchedulePostFeature />
          </FeatureCard>
        </div>
        <div className="hidden xl:block absolute top-0 -left-0 w-16 h-full border text-border bg-[size:15px_15px] [background-image:repeating-linear-gradient(315deg,currentColor_0_1px,#0000_0_50%)]" />
        <div className="hidden xl:block absolute top-0 -right-0 w-16 h-full border text-border bg-[size:15px_15px] [background-image:repeating-linear-gradient(315deg,currentColor_0_1px,#0000_0_50%)]" />
      </section>
    </div>
  );
}
