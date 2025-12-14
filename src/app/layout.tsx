import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/AuthProvider";

const outfit = Outfit({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Dig & Bust - Keep Digging! 💎",
    description: "A simple mining game. Dig through the dirt to reach the Diamond Wall, but don't bust!",
    keywords: ["game", "mining", "diamonds", "web game", "crypto", "solana"],
    icons: {
        icon: "/icon.png",
        apple: "/apple-icon.png",
    },
    openGraph: {
        title: "Dig & Bust - Keep Digging! 💎",
        description: "Dig through the dirt to reach the Diamond Wall!",
        type: "website",
        images: ["/meme.png"],
    },
    twitter: {
        card: "summary_large_image",
        title: "Dig & Bust - Keep Digging! 💎",
        description: "Dig through the dirt to reach the Diamond Wall!",
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
