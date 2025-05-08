"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CalendarIcon } from "lucide-react";
import { SubredditSearchInput } from "./SubredditSearchInput";
import { DateTimePicker24h } from "./ui/DateTimePicker";

interface SchedulePostDialogProps {
  onSchedule: (post: {
    title: string;
    content: string;
    scheduledDate: Date;
    subreddit: string;
  }) => void;
}

export function SchedulePostDialog({ onSchedule }: SchedulePostDialogProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [subreddit, setSubreddit] = useState("");
  const [scheduledDate, setScheduledDate] = useState<Date | undefined>(
    undefined
  );
  const [open, setOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (scheduledDate && subreddit) {
      // Combine date and time
      const scheduledDateTime = new Date(scheduledDate);

      onSchedule({
        title,
        content,
        scheduledDate: scheduledDateTime,
        subreddit,
      });
      setTitle("");
      setContent("");
      setSubreddit("");
      setScheduledDate(new Date());
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full" size={"sm"}>
          Schedule Post <CalendarIcon className="size-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Schedule New Post</DialogTitle>
          <DialogDescription>
            Create a new post and schedule it for later publication.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid gap-2 relative w-full">
            <Label>Subreddit</Label>
            <SubredditSearchInput value={subreddit} setValue={setSubreddit} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter post title"
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="content">Content</Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Enter post content"
              required
            />
          </div>
          <div className="grid grid-cols-1 gap-4">
            <DateTimePicker24h
              date={scheduledDate}
              setDate={setScheduledDate}
            />
          </div>
          <DialogFooter>
            <Button type="submit" disabled={!subreddit}>
              Schedule Post
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
