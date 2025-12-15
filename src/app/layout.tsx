import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/AuthProvider";

const outfit = Outfit({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Miner: Never Give Up! 💎⛏️",
    description: "The classic 'never give up' meme turned into a game. Keep digging to reach the Diamond Wall!",
    keywords: ["game", "mining", "diamonds", "web game", "never give up", "meme game"],
    icons: {
        icon: "/icon.png",
        apple: "/apple-icon.png",
    },
    openGraph: {
        title: "Miner: Never Give Up! 💎⛏️",
        description: "The classic 'never give up' meme turned into a game!",
        type: "website",
        images: ["/meme.png"],
    },
    twitter: {
        card: "summary_large_image",
        title: "Miner: Never Give Up! 💎⛏️",
        description: "The classic 'never give up' meme turned into a game!",
        images: ["/meme.png"],
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={`${outfit.className} antialiased`}>
                <AuthProvider>
                    {children}
                </AuthProvider>
            </body>
        </html>
    );
}
