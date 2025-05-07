import { FaRedditAlien } from "react-icons/fa";

const RedditLogoPill = () => {
  return (
    <span
      className="
        w-min bg-gradient-to-b from-primary to-primary/80 
        text-white
        font-medium
        p-2
        rounded-sm
        border
        border-orange-700/50
        shadow-[0_2px_4px_rgba(0,0,0,0.2)]
        items-center
        justify-center
        hover:shadow-[0_3px_6px_rgba(0,0,0,0.3)]
        active:shadow-[0_1px_2px_rgba(0,0,0,0.2)]
        active:translate-y-[1px]
        transition-all
        duration-150
         hidden sm:inline-flex
      "
    >
      <FaRedditAlien className="text-white sm:size-5 md:size-6 lg:size-7 xl:size-8" />
    </span>
  );
};

export default RedditLogoPill;
