import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#7f13ec",
        secondary: "#28A0F0",
        "background-light": "#f7f6f8",
        "background-dark": "#191022",
        "surface-dark": "#252525",
        "surface-light": "#ffffff",
        "ide-bg": "#1e1e1e",
        "ide-sidebar": "#252526",
        "ide-border": "#333333",
        "ide-text": "#d4d4d4",
        "ide-text-secondary": "#858585",
        "accent-blue": "#28a0f0",
        "accent-purple": "#a965e8",
        "accent-green": "#3fb950",
        "accent-orange": "#ce9178",
        "accent-yellow": "#dcdcaa",
        "text-light-primary": "#E0E0E0",
        "text-light-secondary": "#A0A0A0",
      },
      fontFamily: {
        display: ["Inter", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      borderRadius: {
        DEFAULT: "0.5rem",
        lg: "0.75rem",
        xl: "1rem",
        "2xl": "2rem",
        "3xl": "3rem",
      },
    },
  },
  plugins: [],
};

export default config;
