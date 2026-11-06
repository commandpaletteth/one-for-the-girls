import type { Config } from "tailwindcss";

// Brand colours live here only. Components use these tokens, never raw hex.
const config: Config = {
  content: ["./components/**/*.{js,ts,jsx,tsx,mdx}", "./app/**/*.{js,ts,jsx,tsx,mdx}", "./lib/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Inter Variable"', "sans-serif"],
        serif: ['"Playfair Display Variable"', "serif"],
      },
      colors: {
        background: "#FAF7F5", // cream page background
        foreground: "#4A4A4A", // main text
        blush: "#F4E9E6", // soft section background
        primary: {
          DEFAULT: "#B85C5C", // rose gold
          dark: "#9E4F4F",
          foreground: "#FFFFFF",
        },
        secondary: {
          DEFAULT: "#D4A373", // muted gold
          dark: "#8C6B4A",
          foreground: "#FFFFFF",
        },
        muted: "#6B5B5B", // secondary text
        border: "#E8C4C4", // light pink border
      },
      animation: {
        "fade-in": "fadeIn 0.8s ease-out forwards",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
