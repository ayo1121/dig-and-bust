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
                // Warm earth tones from the meme
                earth: {
                    cream: "#f5e6d3",
                    light: "#d4a574",
                    DEFAULT: "#8B6914",
                    brown: "#6d5a3a",
                    dark: "#4a3a1a",
                    darker: "#2d1810",
                },
                dirt: {
                    light: "#a67c52",
                    DEFAULT: "#8B6914",
                    dark: "#5c4a1f",
                    darker: "#3d2e0f",
                },
                // Vibrant diamond blue
                diamond: {
                    light: "#b0e0e6",
                    DEFAULT: "#4fc3f7",
                    dark: "#0288d1",
                    glow: "#81d4fa",
                },
                // Dark tunnel background
                tunnel: {
                    bg: "#1a0f08",
                    wall: "#0d0604",
                    surface: "#2d1810",
                },
                // Accent colors
                gold: {
                    light: "#ffd54f",
                    DEFAULT: "#ffb300",
                    dark: "#ff8f00",
                },
                danger: {
                    light: "#ef5350",
                    DEFAULT: "#d32f2f",
                    dark: "#b71c1c",
                },
                success: {
                    light: "#66bb6a",
                    DEFAULT: "#43a047",
                    dark: "#2e7d32",
                },
            },
            animation: {
                "dig-shake": "dig-shake 0.3s ease-in-out",
                "gem-pop": "gem-pop 0.5s ease-out",
                "pulse-glow": "pulse-glow 2s ease-in-out infinite",
                "float": "float 3s ease-in-out infinite",
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
                "float": {
                    "0%, 100%": { transform: "translateY(0)" },
                    "50%": { transform: "translateY(-10px)" },
                },
            },
            backgroundImage: {
                "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
                "gradient-earth": "linear-gradient(135deg, #2d1810 0%, #1a0f08 50%, #0d0604 100%)",
            },
        },
    },
    plugins: [],
};
export default config;
