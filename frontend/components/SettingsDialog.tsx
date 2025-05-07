"use client";
import { toast } from "sonner";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import updateEmail from "@/lib/update-email";
import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";

const SettingsDialog = ({ children }: { children: React.ReactNode }) => {
  const [email, setEmail] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isFirstTime, setIsFirstTime] = useState<boolean>(true);

  useEffect(() => {
    // Check if user has updated email before
    const hasUpdatedEmail = localStorage.getItem("hasUpdatedEmail");
    if (hasUpdatedEmail) {
      setIsFirstTime(false);
    }
  }, []);

  const handleChangeEmail = async () => {
    setIsLoading(true);
    const result = await updateEmail(email);

    if (result.message === "Email updated successfully") {
      toast.success(result.message);
      setIsFirstTime(false);
      localStorage.setItem("hasUpdatedEmail", "true");
    } else {
      toast.error(result.message);
    }

    setIsLoading(false);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="peer/menu-button flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left text-sm outline-hidden ring-sidebar-ring transition-[width,height,padding] hover:bg-sidebar-accent  focus-visible:ring-2 active:bg-sidebar-accent disabled:pointer-events-none disabled:opacity-50 group-has-data-[sidebar=menu-action]/menu-item:pr-8 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-[active=true]:bg-sidebar-accent data-[active=true]:font-medium data-[active=true]:text-sidebar-accent-foreground data-[state=open]:hover:bg-sidebar-accent data-[state=open]:hover:text-sidebar-accent-foreground group-data-[collapsible=icon]:size-8! group-data-[collapsible=icon]:p-2! [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0 [&>svg]:text-muted-foreground cursor-pointer relative">
          {children}
          {isFirstTime && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2">
                    <div className="h-2.5 w-2.5 rounded-full bg-primary animate-ping" />
                    <div className="absolute inset-0 h-2.5 w-2.5 rounded-full bg-primary" />
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>You need to set your email</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
        </DialogHeader>
        <div className="grid gap-y-4 py-4">
          <div className="grid grid-cols-1 items-center gap-2">
            <Label htmlFor="name" className="text-right">
              Email
            </Label>
            <p className="text-muted-foreground text-sm">
              You will recieve notifications here
            </p>
            <div className="grid grid-cols-3 gap-x-1">
              <Input
                id="email"
                type="email"
                placeholder="your-email@gmail.com"
                className="col-span-2"
                autoComplete="off"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Button
                variant={"secondary"}
                onClick={handleChangeEmail}
                disabled={isLoading || email === ""}
              >
                {isLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  "Save"
                )}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SettingsDialog;
