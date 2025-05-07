"use client";
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
import { Loader2, Search } from "lucide-react";
import { SubredditSearchInput } from "./SubredditSearchInput";
import { useState } from "react";
import postTrackedKeyword from "@/lib/post-tracked-keyword";
import { toast } from "sonner";

interface SearchKeywordDialogProps {
  onKeywordAdded: (keyword: string, subreddit: string) => void;
}

const SearchKeywordDialog = ({ onKeywordAdded }: SearchKeywordDialogProps) => {
  const [keyword, setKeyword] = useState<string>("");
  const [subreddit, setSubreddit] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [open, setOpen] = useState(false);

  const handleAddKeyword = async () => {
    try {
      setLoading(true);
      const response = await postTrackedKeyword(keyword, subreddit);
      if (response.error) {
        toast.error(response.error);
      } else {
        toast.success(response.message);
        onKeywordAdded(keyword, subreddit);
        setOpen(false);
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
      setKeyword("");
      setSubreddit("");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={"default"} size={"sm"} className="w-full">
          Search Keyword
          <Search className="ml-2 h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add new keyword</DialogTitle>
          <DialogDescription>
            Select keyword and a subreddit to track it.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Keyword
            </Label>
            <Input
              id="name"
              className="col-span-3"
              autoComplete="off"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-right">
              Subreddit
            </Label>
            <SubredditSearchInput value={subreddit} setValue={setSubreddit} />
          </div>
        </div>
        <DialogFooter>
          <Button
            type="submit"
            onClick={handleAddKeyword}
            disabled={loading || !keyword || !subreddit}
          >
            {loading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              "Track Keyword"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SearchKeywordDialog;
