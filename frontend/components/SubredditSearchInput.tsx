"use client";
import * as React from "react";
import { ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import axios from "axios";
import Image from "next/image";
import cleanUpUrl from "@/utils/clean-up-url";

interface SubredditProps {
  name: string;
  url: string;
  icon: string;
}

export function SubredditSearchInput({
  value,
  setValue,
}: {
  value: string;
  setValue: (value: string) => void;
}) {
  const [open, setOpen] = React.useState(false);
  const [inputValue, setInputValue] = React.useState("");
  const [subreddits, setSubreddits] = React.useState<SubredditProps[]>([]);
  const [loading, setLoading] = React.useState(false);

  // Function to fetch subreddits when the input changes
  const fetchSubreddits = React.useCallback(async (query: string) => {
    if (!query) {
      setSubreddits([]);
      return;
    }

    setLoading(true);
    try {
      const response = await axios.get(
        `${
          process.env.NEXT_PUBLIC_API_URL
        }/api/reddit/search-subreddits?q=${encodeURIComponent(query)}`,
        {
          withCredentials: true,
        }
      );

      if (!response.status) {
        throw new Error("Failed to fetch subreddits");
      }

      const data = Array.isArray(response.data.subreddits)
        ? response.data.subreddits
        : [];

      setSubreddits(
        data
          .filter(
            (item: any) =>
              item && item.name && item.url && item.icon !== undefined
          )
          .map((item: any) => ({
            name: item.name,
            url: item.url,
            icon: item.icon,
          }))
      );
    } catch (error) {
      console.error("Error fetching subreddits:", error);
      setSubreddits([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Debounce function to prevent too many API calls
  React.useEffect(() => {
    const timer = setTimeout(() => {
      fetchSubreddits(inputValue);
    }, 300); // 300ms debounce

    return () => clearTimeout(timer);
  }, [inputValue, fetchSubreddits]);

  return (
    <div className="relative col-span-3">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
          >
            {value
              ? subreddits.find((subreddit) => subreddit.name === value)
                  ?.name || value
              : "Select subreddit..."}
            <ChevronsUpDown className="opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="flex p-0">
          <Command>
            <CommandInput
              placeholder="Search subreddit..."
              value={inputValue}
              onValueChange={setInputValue}
            />
            <CommandList>
              <CommandEmpty>
                {loading
                  ? "Loading..."
                  : inputValue
                  ? "No subreddit found."
                  : "Try searching for a subreddit"}
              </CommandEmpty>
              {subreddits.length > 0 && (
                <CommandGroup>
                  {subreddits?.map((subreddit) => (
                    <CommandItem
                      key={subreddit.name}
                      value={subreddit.name}
                      onSelect={(currentValue) => {
                        setValue(
                          currentValue === value ? "" : `r/${currentValue}`
                        );
                        setOpen(false);
                      }}
                      className="flex flex-row gap-x-4"
                    >
                      {subreddit.icon === "" ? (
                        <div className="w-7 h-7 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
                          <span className="text-base font-medium">r/</span>
                        </div>
                      ) : (
                        <Image
                          src={cleanUpUrl(subreddit.icon)}
                          alt={`${subreddit.name}'s icon`}
                          width={28}
                          height={28}
                          className="rounded-full"
                        />
                      )}
                      <span>r/{subreddit.name}</span>
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
