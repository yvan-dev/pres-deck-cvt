"use client";

import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
    type ReactNode,
} from "react";

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

/**
 * Fournit l'état du deck (slide courant, modes overview/black)
 * et synchronise l'URL via ?slide=N.
 */
export const DeckProvider = ({ total, children }: DeckProviderProps) => {
    const [current, setCurrent] = useState<number>(() => {
        if (typeof window === "undefined") return 0;
        const params = new URLSearchParams(window.location.search);
        const raw = params.get("slide");
        const parsed = raw ? parseInt(raw, 10) - 1 : 0;
        if (Number.isNaN(parsed)) return 0;
        return Math.max(0, Math.min(total - 1, parsed));
    });
    const [isOverview, setIsOverview] = useState(false);
    const [isBlackScreen, setIsBlackScreen] = useState(false);

    // Synchronise URL sans rechargement
    useEffect(() => {
        if (typeof window === "undefined") return;
        const url = new URL(window.location.href);
        url.searchParams.set("slide", String(current + 1));
        window.history.replaceState({}, "", url.toString());
    }, [current]);

    const goTo = useCallback(
        (index: number) => {
            const clamped = Math.max(0, Math.min(total - 1, index));
            setCurrent(clamped);
            setIsOverview(false);
            setIsBlackScreen(false);
        },
        [total]
    );

    const next = useCallback(() => {
        setCurrent((c) => Math.min(total - 1, c + 1));
    }, [total]);

    const previous = useCallback(() => {
        setCurrent((c) => Math.max(0, c - 1));
    }, []);

    const first = useCallback(() => setCurrent(0), []);
    const last = useCallback(() => setCurrent(total - 1), [total]);

    const toggleOverview = useCallback(
        () => setIsOverview((v) => !v),
        []
    );
    const closeOverview = useCallback(() => setIsOverview(false), []);

    const toggleBlackScreen = useCallback(
        () => setIsBlackScreen((v) => !v),
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
        ]
    );

    return (
        <DeckContext.Provider value={value}>{children}</DeckContext.Provider>
    );
};

export const useDeck = (): DeckContextValue => {
    const ctx = useContext(DeckContext);
    if (!ctx) {
        throw new Error("useDeck must be used within a DeckProvider");
    }
    return ctx;
};
