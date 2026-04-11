import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
    display: "swap",
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
    display: "swap",
});

export const metadata: Metadata = {
    title: "Le développement agentique à AOT · CVT",
    description:
        "Un CVT par Yvan Gunewou — comprendre les 5 niveaux de maturité IA et construire le pôle IA d'ACTON Technology.",
    authors: [{ name: "Yvan Gunewou" }],
    keywords: [
        "IA",
        "développement agentique",
        "Claude Code",
        "ACTON Technology",
        "AOT",
        "D2R2",
        "BMAD",
        "LangGraph",
    ],
};

export const viewport: Viewport = {
    themeColor: "#020402",
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
            className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
        >
            <body className="relative h-full w-full overflow-hidden">
                {children}
            </body>
        </html>
    );
}
