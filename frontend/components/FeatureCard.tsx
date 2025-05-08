import { cn } from "@/lib/utils";

const FeatureCard = ({
  children,
  title,
  description,
  fadeOnBottom,
  fadeOnTop,
}: {
  children: React.ReactNode;
  title: string;
  description: string;
  fadeOnBottom?: boolean;
  fadeOnTop?: boolean;
}) => {
  return (
    <div
      className={cn(
        "flex flex-col items-start justify-end min-h-[400px] md:min-h-[450px] p-0.5 relative before:absolute before:-left-0.5 before:top-0 before:z-10 before:h-screen before:w-px before:bg-border before:content-[''] after:absolute after:-top-0.5 after:left-0 after:z-10 after:h-px after:w-screen after:bg-border after:content-[''] group cursor-pointer max-h-[400px] group"
      )}
    >
      <div className="relative flex size-full items-center justify-center h-full overflow-hidden">
        {children}
        {fadeOnBottom && (
          <div className="absolute bottom-0 left-0 w-full h-48 bg-gradient-to-t from-background to-transparent" />
        )}
        {fadeOnTop && (
          <div className="absolute top-0 left-0 w-full h-20 bg-gradient-to-b from-background to-transparent" />
        )}
      </div>
      <div className="flex-1 flex-col gap-2 p-6">
        <h3 className="text-lg tracking-tighter font-medium">{title}</h3>
        <p className="text-muted-foreground">{description}</p>
      </div>
    </div>
  );
};

export default FeatureCard;
