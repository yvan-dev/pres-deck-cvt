"use client";

import { Moon, Sun } from "lucide-react";
import { useSyncExternalStore } from "react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

const subscribe = () => () => undefined;
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

export const ThemeToggle = () => {
    const { resolvedTheme, setTheme } = useTheme();
    const mounted = useSyncExternalStore(
        subscribe,
        getClientSnapshot,
        getServerSnapshot
    );

    const isLight = mounted && resolvedTheme === "light";

    return (
        <button
            type="button"
            aria-label={isLight ? "Activer le theme sombre" : "Activer le theme clair"}
            title={isLight ? "Theme sombre" : "Theme clair"}
            onClick={() => setTheme(isLight ? "dark" : "light")}
            className="theme-toggle pointer-events-auto"
        >
            <span
                className={cn(
                    "theme-toggle__thumb",
                    isLight ? "translate-x-[1.35rem]" : "translate-x-0"
                )}
            >
                {isLight ? <Sun size={12} strokeWidth={2.2} /> : <Moon size={12} strokeWidth={2.2} />}
            </span>
        </button>
    );
};
