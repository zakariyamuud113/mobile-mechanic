import { Link } from "@tanstack/react-router";
import brandMark from "@/assets/brand-mark.png";
import { cn } from "@/lib/utils";

interface BrandProps {
  /** Renders the wordmark next to the mark. Defaults to true. */
  showWordmark?: boolean;
  size?: "sm" | "md" | "lg";
  /** Wrap in a Link to home. Defaults to true. */
  asLink?: boolean;
  className?: string;
}

const markSizes = { sm: "h-7 w-7", md: "h-9 w-9", lg: "h-11 w-11" } as const;
const textSizes = { sm: "text-sm", md: "text-lg", lg: "text-xl" } as const;

export function Brand({
  showWordmark = true,
  size = "md",
  asLink = true,
  className,
}: BrandProps) {
  const inner = (
    <span className={cn("flex items-center gap-2", className)}>
      <img
        src={brandMark}
        alt="Mobile Mechanic logo"
        width={512}
        height={512}
        loading="lazy"
        className={cn("rounded-xl object-cover", markSizes[size])}
      />
      {showWordmark && (
        <span className={cn("font-display font-semibold leading-none", textSizes[size])}>
          Mobile Mechanic
        </span>
      )}
    </span>
  );

  if (!asLink) return inner;
  return (
    <Link to="/" className="inline-flex items-center hover:opacity-90">
      {inner}
    </Link>
  );
}
