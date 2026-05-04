import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        ritual: {
          bg: "#0a0a0a",
          surface: "#111111",
          border: "#1f1f1f",
          muted: "#737373",
          fg: "#ededed",
          accent: "#f97316",       // warm amber/orange
          accentSoft: "#fb923c",
          success: "#22c55e",
          verified: "#3b82f6",     // blue checkmark
        },
      },
      fontFamily: {
        mono: ["'JetBrains Mono'", "ui-monospace", "monospace"],
        sans: ["'Inter'", "ui-sans-serif", "system-ui"],
      },
      backgroundImage: {
        "dot-grid":
          "radial-gradient(circle, #1f1f1f 1px, transparent 1px)",
      },
      backgroundSize: { "dot-grid": "24px 24px" },
    },
  },
};
export default config;