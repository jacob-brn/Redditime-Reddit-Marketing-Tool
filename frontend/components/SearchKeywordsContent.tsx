"use client";

import { useEffect, useState } from "react";
import { fetchTrackedKeywords, TrackedKeyword } from "@/lib/api";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Skeleton } from "./ui/skeleton";
import SearchKeywordDialog from "./SearchKeywordDialog";
import TrackedKeywordCard from "./TrackedKeywordCard";

export default function SearchKeywordsContent() {
  const [keywords, setKeywords] = useState<TrackedKeyword[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const loadKeywords = async () => {
      try {
        const data = await fetchTrackedKeywords();
        setKeywords(data);
      } catch (err: any) {
        if (err.status === 401) {
          router.push("/login");
          return;
        }
        console.log(err);
        setError(err.message || "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    loadKeywords();
  }, [router]);

  const handleKeywordAdded = async () => {
    try {
      const data = await fetchTrackedKeywords();
      setKeywords(data);
    } catch (err: any) {
      if (err.status === 401) {
        router.push("/login");
        return;
      }
      console.log(err);
      setError(err.message || "An error occurred");
    }
  };

  if (error) {
    return (
      <div className="flex flex-grow items-center">
        <div className="max-w-xs w-full h-min mx-auto border bg-accent p-4 rounded-sm">
          <h1 className="font-medium text-base text-red-500">
            Error loading keywords
          </h1>
          <p className="text-sm text-muted-foreground max-w-sm mt-1">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-4 p-4 border bg-sidebar rounded-md">
      <div className="max-w-full grid gap-y-4">
        <h1 className="text-2xl font-semibold">Tracked Keywords</h1>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {loading ? (
          <>
            {[...Array(3)].map((_, index) => (
              <Card
                key={index}
                className="p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Skeleton className="w-10 h-10 rounded-full" />
                      <Skeleton className="h-4 w-20" />
                    </div>
                    <Skeleton className="h-8 w-8 rounded-full" />
                  </div>
                  <Skeleton className="h-6 w-3/4" />
                </div>
              </Card>
            ))}
          </>
        ) : keywords.length === 0 ? (
          <Card>
            <CardHeader>
              <CardTitle>There are no tracked keywords yet</CardTitle>
              <CardDescription>
                Start by specifying keyword and a subreddit.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SearchKeywordDialog onKeywordAdded={handleKeywordAdded} />
            </CardContent>
          </Card>
        ) : (
          <>
            {keywords.map((keyword) => (
              <TrackedKeywordCard
                key={keyword.id}
                id={keyword.id}
                keyword={keyword.keyword}
                subreddit={keyword.subreddit}
                subredditIconUrl={keyword.iconUrl || ""}
                onDelete={() => {
                  setKeywords(keywords.filter((k) => k.id !== keyword.id));
                }}
              />
            ))}
            <Card>
              <CardHeader>
                <CardTitle>Create new Keyword</CardTitle>
              </CardHeader>
              <CardContent>
                <SearchKeywordDialog onKeywordAdded={handleKeywordAdded} />
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}
