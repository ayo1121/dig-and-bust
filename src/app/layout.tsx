import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/AuthProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Dig & Bust - Keep Digging! 💎",
    description: "A simple mining game. Dig through the dirt to reach the Diamond Wall, but don't bust!",
    keywords: ["game", "mining", "diamonds", "web game"],
    openGraph: {
        title: "Dig & Bust - Keep Digging! 💎",
        description: "Dig through the dirt to reach the Diamond Wall!",
        type: "website",
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={`${inter.className} antialiased`}>
                <AuthProvider>
                    {children}
                </AuthProvider>
            </body>
        </html>
    );
}
