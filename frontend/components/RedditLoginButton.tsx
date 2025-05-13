"use client";
import { signInWithReddit } from "@/lib/auth-client";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

const RedditLoginButton = ({
  children,
  className,
  ...props
}: {
  children: React.ReactNode;
  className?: string;
} & React.ComponentProps<"button">) => {
  return (
    <Button
      variant={"default"}
      {...props}
      className={cn(
        "[box-shadow:0px_0px_12px_-3px_var(--background)_inset] cursor-pointer",
        className
      )}
      onClick={signInWithReddit}
    >
      {children}
    </Button>
  );
};

export default RedditLoginButton;
