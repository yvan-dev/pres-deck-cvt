import { cn } from "@/lib/utils";

type SectionEyebrowProps = {
    eyebrow: string;
    title: string;
    size?: "lg" | "md";
    className?: string;
};

export const SectionEyebrow = ({
    eyebrow,
    title,
    size = "lg",
    className,
}: SectionEyebrowProps) => (
    <div className={cn("flex flex-col gap-2", className)}>
        <span className="industrial-kicker">{eyebrow}</span>
        <h2
            className={cn(
                "font-display font-semibold tracking-[-0.05em] text-[color:var(--aot-text)]",
                size === "lg" && "text-5xl lg:text-6xl",
                size === "md" && "text-3xl lg:text-4xl"
            )}
        >
            {title}
        </h2>
    </div>
);
