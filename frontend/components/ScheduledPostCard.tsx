import { ScheduledPost } from "@/lib/api";
import DeleteScheduledPostDialog from "./DeleteScheduledPostDialog";
import { CalendarClock, CheckCircle, Clock, XCircle } from "lucide-react";

const ScheduledPostCard = ({
  id,
  subreddit,
  title,
  scheduledFor,
  status,
  handleDelete,
}: ScheduledPost & { handleDelete: () => void }) => {
  const formatDateTime = (date: string) => {
    return new Date(date).toLocaleString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="p-4 border rounded-md bg-card hover:bg-accent transition-colors">
      <div className="flex items-center gap-2 mb-2 justify-between">
        <div className="flex flex-row gap-2 items-center justify-center">
          <div className="w-6 h-6 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center"></div>
          <span className="text-sm text-muted-foreground">{subreddit}</span>
        </div>
        <DeleteScheduledPostDialog
          onDelete={handleDelete}
          title={title}
          subreddit={subreddit}
          scheduledFor={formatDateTime(scheduledFor)}
        />
      </div>
      <h3 className="font-semibold mb-2">{title}</h3>
      <div className="flex flex-row justify-between items-center">
        <p className="text-xs text-muted-foreground flex items-center gap-1">
          <CalendarClock className="w-4 h-4" />
          {formatDateTime(scheduledFor)}
        </p>
        <p className="text-xs text-muted-foreground flex items-center gap-1 [&_svg]:w-4 [&_svg]:h-4">
          {status === "pending" ? (
            <Clock className="h-4 w-4 text-yellow-500" />
          ) : status === "posted" ? (
            <CheckCircle className="h-4 w-4 text-green-500" />
          ) : (
            <XCircle className="h-4 w-4 text-red-500" />
          )}
        </p>
      </div>
    </div>
  );
};

export default ScheduledPostCard;
