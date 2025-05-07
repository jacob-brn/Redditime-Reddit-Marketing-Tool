import siteConfig from "@/config/config";
import { Button } from "./ui/button";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { FaGithub } from "react-icons/fa6";

const Navbar = () => {
  return (
    <header className="sticky top-0 z-50 w-full px-6 py-4 flex flex-row justify-between border-b [box-shadow:0px_0px_35px_-30px_var(--foreground)_inset] bg-background">
      <div className="flex flex-row items-center justify-center gap-x-2">
        <div className="relative size-8 md:size-7 p-1">
          <Image
            src={"/logo.png"}
            fill
            alt="Redditime's Logo"
            className="bg-white rounded-sm"
          />
        </div>
        <span className="text-2xl font-semibold cursor-pointer hidden md:block">
          {siteConfig.name}
        </span>
      </div>
      <div className="block">
        <nav className=""></nav>
      </div>
      <div className="flex gap-2">
        <Link href={siteConfig.githubRepoUrl}>
          <Button
            variant={"outline"}
            className="w-full [box-shadow:0px_0px_8px_-5px_var(--foreground)_inset]"
          >
            <FaGithub />
            <span className="hidden md:block">Source</span>Code
          </Button>
        </Link>
        <Link href={"/login"}>
          <Button className="w-full bg-gradient-to-b from-primary to-primary/70 [box-shadow:0px_0px_12px_-1px_var(--background)_inset] gap-0.5 group">
            Get Started
            <ArrowRight className="size-4 group-hover:-rotate-45 transition-transform duration-300" />
          </Button>
        </Link>
      </div>
    </header>
  );
};

export default Navbar;
