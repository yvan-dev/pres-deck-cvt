import type { Metadata, Viewport } from "next";
import {
    IBM_Plex_Mono,
    IBM_Plex_Sans,
    Space_Grotesk,
} from "next/font/google";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import "./globals.css";

const plexSans = IBM_Plex_Sans({
    variable: "--font-plex-sans",
    subsets: ["latin"],
    display: "swap",
    weight: ["400", "500", "600", "700"],
});

const plexMono = IBM_Plex_Mono({
    variable: "--font-plex-mono",
    subsets: ["latin"],
    display: "swap",
    weight: ["400", "500", "600"],
});

const spaceGrotesk = Space_Grotesk({
    variable: "--font-space-grotesk",
    subsets: ["latin"],
    display: "swap",
});

export const metadata: Metadata = {
    title: "Le développement agentique à AOT · CVT",
    description:
        "Executive deck sur la maturité IA chez AOT: où nous sommes, pourquoi viser le niveau 3 rapidement, et comment structurer une capacité IA crédible.",
    authors: [{ name: "Yvan Gunewou" }],
    keywords: [
        "IA",
        "développement agentique",
        "Claude Code",
        "ACTON Technology",
        "AOT",
        "RMC",
        "BMAD",
        "LangGraph",
    ],
};

export const viewport: Viewport = {
    themeColor: "#040807",
    width: "device-width",
    initialScale: 1,
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html
            lang="fr"
            suppressHydrationWarning
            className={`${plexSans.variable} ${plexMono.variable} ${spaceGrotesk.variable} h-full antialiased`}
        >
            <body className="relative h-full w-full overflow-hidden bg-[color:var(--aot-bg-base)] text-[color:var(--aot-text)]">
                <ThemeProvider>{children}</ThemeProvider>
            </body>
        </html>
    );
}
