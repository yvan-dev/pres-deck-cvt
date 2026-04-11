import { cn } from "@/lib/utils";

type SectionEyebrowProps = {
    eyebrow: string;
    title: string;
    size?: "lg" | "md";
    className?: string;
};

/**
 * Pattern eyebrow + titre utilisé en haut de chaque slide de contenu.
 * size="lg" (défaut) → titre principal de slide (text-5xl / text-6xl)
 * size="md"          → titre de section dans une slide composite
 */
export const SectionEyebrow = ({
    eyebrow,
    title,
    size = "lg",
    className,
}: SectionEyebrowProps) => (
    <div className={cn("flex flex-col gap-1.5", className)}>
        <span className="font-mono text-xs uppercase tracking-[0.25em] text-[color:var(--aot-text-dim)]">
            {eyebrow}
        </span>
        <h2
            className={cn(
                "font-semibold tracking-tight text-[color:var(--aot-text)]",
                size === "lg" && "text-5xl lg:text-6xl",
                size === "md" && "text-3xl lg:text-4xl"
            )}
        >
            {title}
        </h2>
    </div>
);
