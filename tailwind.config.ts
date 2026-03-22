import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        sand: {
          50: "#FDF8EE",
          100: "#F5E6C8",
          200: "#EDD49E",
          300: "#E8C87A",
        },
        ocean: {
          light: "#2E86AB",
          DEFAULT: "#1B6CA8",
          dark: "#145480",
        },
        coral: {
          DEFAULT: "#FF6B6B",
          dark: "#E85555",
        },
        wave: "#4ECDC4",
      },
      fontFamily: {
        pacifico: ["var(--font-pacifico)", "cursive"],
        inter: ["var(--font-inter)", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
