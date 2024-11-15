import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CalendarDays, Clock } from "lucide-react";

interface PostHeaderProps {
  title: string;
  description?: string;
  date: string;
  tags?: string[];
  readingTime?: string;
}

export function PostHeader({
  title,
  description,
  date,
  tags,
  readingTime,
}: PostHeaderProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
          {title}
        </h1>
        {description && (
          <p className="text-xl text-muted-foreground leading-8">
            {description}
          </p>
        )}
      </div>
      <div className="flex flex-col gap-y-4 md:flex-row md:items-center md:gap-x-8">
        <div className="flex flex-wrap items-center gap-x-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-x-2">
            <CalendarDays className="h-4 w-4" />
            <time dateTime={date}>
              {new Date(date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </time>
          </div>
          {readingTime && (
            <div className="flex items-center gap-x-2">
              <Clock className="h-4 w-4" />
              <span>{readingTime}</span>
            </div>
          )}
        </div>
        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <Badge key={tag} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </div>
      <Separator />
    </div>
  );
}
