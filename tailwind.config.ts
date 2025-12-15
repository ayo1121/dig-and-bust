import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                // Clean, minimal palette
                primary: {
                    50: "#fef7ee",
                    100: "#fdedd3",
                    200: "#f9d8a6",
                    300: "#f5bc6e",
                    400: "#f09635",
                    500: "#ec7a12",  // Main orange
                    600: "#dd5f09",
                    700: "#b7460a",
                    800: "#923810",
                    900: "#763010",
                },
                secondary: {
                    50: "#ecfeff",
                    100: "#cffafe",
                    200: "#a5f3fc",
                    300: "#67e8f9",
                    400: "#22d3ee",
                    500: "#06b6d4",  // Main cyan
                    600: "#0891b2",
                    700: "#0e7490",
                    800: "#155e75",
                    900: "#164e63",
                },
                dark: {
                    50: "#f8fafc",
                    100: "#f1f5f9",
                    200: "#e2e8f0",
                    300: "#cbd5e1",
                    400: "#94a3b8",
                    500: "#64748b",
                    600: "#475569",
                    700: "#334155",
                    800: "#1e293b",
                    900: "#0f172a",  // Main dark
                    950: "#020617",
                },
                success: "#10b981",
                danger: "#ef4444",
                warning: "#f59e0b",
            },
            fontFamily: {
                sans: ["Outfit", "system-ui", "sans-serif"],
            },
            animation: {
                "shake": "shake 0.3s ease-in-out",
                "pop": "pop 0.3s ease-out",
                "float": "float 3s ease-in-out infinite",
                "glow": "glow 2s ease-in-out infinite",
            },
            keyframes: {
                shake: {
                    "0%, 100%": { transform: "translateX(0)" },
                    "25%": { transform: "translateX(-4px)" },
                    "75%": { transform: "translateX(4px)" },
                },
                pop: {
                    "0%": { transform: "scale(0.8)", opacity: "0" },
                    "50%": { transform: "scale(1.1)" },
                    "100%": { transform: "scale(1)", opacity: "1" },
                },
                float: {
                    "0%, 100%": { transform: "translateY(0)" },
                    "50%": { transform: "translateY(-8px)" },
                },
                glow: {
                    "0%, 100%": { opacity: "0.5" },
                    "50%": { opacity: "1" },
                },
            },
            boxShadow: {
                "glow-primary": "0 0 20px rgba(236, 122, 18, 0.3)",
                "glow-secondary": "0 0 20px rgba(6, 182, 212, 0.3)",
            },
        },
    },
    plugins: [],
};
export default config;
