import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merge Tailwind classes with clsx + tailwind-merge.
 * Usage: cn("px-2", condition && "px-4") → "px-4"
 */
export const cn = (...inputs: ClassValue[]): string => {
    return twMerge(clsx(inputs));
};
