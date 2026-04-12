"use client";

import {
    createContext,
    useCallback,
    useContext,
    useMemo,
    useState,
    type ReactNode,
} from "react";
import {
    usePathname,
    useRouter,
    useSearchParams,
} from "next/navigation";

type DeckContextValue = {
    current: number;
    total: number;
    goTo: (index: number) => void;
    next: () => void;
    previous: () => void;
    first: () => void;
    last: () => void;
    isOverview: boolean;
    toggleOverview: () => void;
    closeOverview: () => void;
    isBlackScreen: boolean;
    toggleBlackScreen: () => void;
};

const DeckContext = createContext<DeckContextValue | null>(null);

type DeckProviderProps = {
    total: number;
    children: ReactNode;
};

export const DeckProvider = ({ total, children }: DeckProviderProps) => {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const [isOverview, setIsOverview] = useState(false);
    const [isBlackScreen, setIsBlackScreen] = useState(false);

    const current = useMemo(() => {
        const raw = searchParams.get("slide");
        const parsed = raw ? parseInt(raw, 10) - 1 : 0;

        if (Number.isNaN(parsed)) return 0;

        return Math.max(0, Math.min(total - 1, parsed));
    }, [searchParams, total]);

    const replaceSlide = useCallback(
        (index: number) => {
            const clamped = Math.max(0, Math.min(total - 1, index));
            const params = new URLSearchParams(searchParams.toString());
            params.set("slide", String(clamped + 1));

            router.replace(`${pathname}?${params.toString()}`, {
                scroll: false,
            });
        },
        [pathname, router, searchParams, total]
    );

    const goTo = useCallback(
        (index: number) => {
            replaceSlide(index);
            setIsOverview(false);
            setIsBlackScreen(false);
        },
        [replaceSlide]
    );

    const next = useCallback(() => {
        replaceSlide(current + 1);
    }, [current, replaceSlide]);

    const previous = useCallback(() => {
        replaceSlide(current - 1);
    }, [current, replaceSlide]);

    const first = useCallback(() => {
        replaceSlide(0);
    }, [replaceSlide]);

    const last = useCallback(() => {
        replaceSlide(total - 1);
    }, [replaceSlide, total]);

    const toggleOverview = useCallback(() => setIsOverview((value) => !value), []);
    const closeOverview = useCallback(() => setIsOverview(false), []);
    const toggleBlackScreen = useCallback(
        () => setIsBlackScreen((value) => !value),
        []
    );

    const value = useMemo<DeckContextValue>(
        () => ({
            current,
            total,
            goTo,
            next,
            previous,
            first,
            last,
            isOverview,
            toggleOverview,
            closeOverview,
            isBlackScreen,
            toggleBlackScreen,
        }),
        [
            closeOverview,
            current,
            first,
            goTo,
            isBlackScreen,
            isOverview,
            last,
            next,
            previous,
            toggleBlackScreen,
            toggleOverview,
            total,
        ]
    );

    return <DeckContext.Provider value={value}>{children}</DeckContext.Provider>;
};

export const useDeck = (): DeckContextValue => {
    const context = useContext(DeckContext);

    if (!context) {
        throw new Error("useDeck must be used within a DeckProvider");
    }

    return context;
};
