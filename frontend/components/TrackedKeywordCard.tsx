import { Card } from "./ui/card";
import Image from "next/image";
import deleteTrackedKeyword from "@/lib/delete-tracked-keyword";
import { toast } from "sonner";
import DeleteKeywordDialog from "./DeleteKeywordDialog";

const TrackedKeywordCard = ({
  id,
  keyword,
  subreddit,
  subredditIconUrl,
  onDelete,
}: {
  id: string;
  keyword: string;
  subreddit: string;
  subredditIconUrl: string;
  onDelete: () => void;
}) => {
  const handleDelete = async () => {
    const response = await deleteTrackedKeyword(id);
    if (response.error) {
      toast.error(response.error);
    } else {
      toast.success(response.message);
      onDelete();
    }
  };

  return (
    <Card className="p-4 hover:shadow-md transition-shadow">
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 rounded-full overflow-hidden">
              {subredditIconUrl ? (
                <Image
                  src={subredditIconUrl}
                  alt={`${subreddit}`}
                  fill
                  className="object-cover bg-gradient-to-br from-primary to-primary/30 before:sr-only "
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-primary to-primary/30" />
              )}
            </div>
            <span className="text-muted-foreground">{subreddit}</span>
          </div>
          <DeleteKeywordDialog onDelete={handleDelete} keyword={keyword} />
        </div>
        <div className="text-lg text-foreground font-semibold">
          &quot;{keyword}&quot;
        </div>
      </div>
    </Card>
  );
};

export default TrackedKeywordCard;
