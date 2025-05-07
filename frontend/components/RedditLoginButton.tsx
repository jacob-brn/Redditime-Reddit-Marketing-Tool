"use client";
import { authClient } from "@/lib/auth-client";
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
  const signIn = async () => {
    await authClient.signIn.social({
      provider: "reddit",
      callbackURL: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/`,
    });
  };

  console.log(process.env.NEXT_PUBLIC_APP_URL);
  return (
    <Button
      variant={"default"}
      {...props}
      className={cn(
        "[box-shadow:0px_0px_12px_-3px_var(--background)_inset] cursor-pointer",
        className
      )}
      onClick={signIn}
    >
      {children}
    </Button>
  );
};

export default RedditLoginButton;
