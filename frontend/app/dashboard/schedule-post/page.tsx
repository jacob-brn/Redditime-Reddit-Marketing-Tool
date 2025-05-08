"use client";

import { useEffect, useState } from "react";
import { SchedulePostDialog } from "@/components/SchedulePostDialog";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useRouter } from "next/navigation";
import {
  fetchScheduledPosts,
  ScheduledPost,
  schedulePost,
  NewPost,
  deleteScheduledPost,
} from "@/lib/api";
import ScheduledPostCard from "@/components/ScheduledPostCard";
import { toast } from "sonner";

const SchedulePostDashboardPage = () => {
  const [scheduledPosts, setScheduledPosts] = useState<ScheduledPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const loadScheduledPosts = async () => {
      try {
        const posts = await fetchScheduledPosts();
        setScheduledPosts(posts);
      } catch (err: any) {
        if (err.status === 401) {
          router.push("/login");
          return;
        }
        setError(err.message || "An error occurred while fetching posts");
      } finally {
        setLoading(false);
      }
    };
    loadScheduledPosts();
  }, [router]);

  const handleSchedule = async (post: NewPost) => {
    try {
      const newPost = await schedulePost(post);
      setScheduledPosts((prev) => [...prev, newPost]);
      toast.success("Post scheduled successfully");
    } catch (err: any) {
      toast.error(err.message || "Failed to schedule post");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteScheduledPost(id);
      setScheduledPosts((prev) => prev.filter((post) => post.id !== id));
      toast.success("Post deleted successfully");
    } catch (err: any) {
      toast.error(err.message || "Failed to delete post");
    }
  };

  if (error) {
    return (
      <div className="flex flex-grow items-center">
        <div className="max-w-xs w-full h-min mx-auto border bg-accent p-4 rounded-sm">
          <h1 className="font-medium text-base text-red-500">
            Error loading scheduled posts
          </h1>
          <p className="text-sm text-muted-foreground max-w-sm mt-1">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-4 p-4 border bg-sidebar rounded-md">
      <div className="max-w-full grid gap-y-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold">Scheduled Posts</h1>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {loading ? (
          <>
            {[...Array(3)].map((_, index) => (
              <div
                key={`skeleton-${index}`}
                className="p-4 border rounded-md bg-card hover:bg-accent transition-colors"
              >
                <div className="flex items-center gap-2 mb-2">
                  <Skeleton className="w-6 h-6 rounded-full" />
                  <Skeleton className="h-4 w-20" />
                </div>
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </>
        ) : scheduledPosts.length === 0 ? (
          <Card>
            <CardHeader>
              <CardTitle>There are no scheduled posts yet</CardTitle>
              <CardDescription>
                Start by scheduling your first post.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SchedulePostDialog onSchedule={handleSchedule} />
            </CardContent>
          </Card>
        ) : (
          <>
            {scheduledPosts.map((post) => (
              <ScheduledPostCard
                key={post.id}
                subreddit={post.subreddit}
                title={post.title}
                scheduledFor={post.scheduledFor}
                status={post.status}
                id={post.id}
                handleDelete={() => handleDelete(post.id)}
              />
            ))}
            <Card>
              <CardHeader>
                <CardTitle>Schedule new post</CardTitle>
              </CardHeader>
              <CardContent>
                <SchedulePostDialog onSchedule={handleSchedule} />
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
};

export default SchedulePostDashboardPage;
