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
                dirt: {
                    light: "#a67c52",
                    DEFAULT: "#8B6914",
                    dark: "#5c4a1f",
                    darker: "#3d2e0f",
                },
                diamond: {
                    light: "#b0e0e6",
                    DEFAULT: "#4fc3f7",
                    dark: "#0288d1",
                },
                tunnel: {
                    bg: "#2d1810",
                    wall: "#1a0f08",
                },
            },
            animation: {
                "dig-shake": "dig-shake 0.3s ease-in-out",
                "gem-pop": "gem-pop 0.5s ease-out",
                "pulse-glow": "pulse-glow 2s ease-in-out infinite",
            },
            keyframes: {
                "dig-shake": {
                    "0%, 100%": { transform: "translateX(0)" },
                    "25%": { transform: "translateX(-5px)" },
                    "75%": { transform: "translateX(5px)" },
                },
                "gem-pop": {
                    "0%": { transform: "scale(0) rotate(0deg)", opacity: "0" },
                    "50%": { transform: "scale(1.2) rotate(180deg)", opacity: "1" },
                    "100%": { transform: "scale(1) rotate(360deg)", opacity: "1" },
                },
                "pulse-glow": {
                    "0%, 100%": { boxShadow: "0 0 20px rgba(79, 195, 247, 0.3)" },
                    "50%": { boxShadow: "0 0 40px rgba(79, 195, 247, 0.6)" },
                },
            },
        },
    },
    plugins: [],
};
export default config;
