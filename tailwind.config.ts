import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "hsl(var(--bg))",
        surface: "hsl(var(--surface))",
        surface2: "hsl(var(--surface-2))",
        line: "hsl(var(--line))",
        primary: "hsl(var(--primary))",
        primaryDeep: "hsl(var(--primary-deep))",
        coral: "hsl(var(--coral))",
        success: "hsl(var(--success))",
        warning: "hsl(var(--warning))",
        text: "hsl(var(--text))",
        muted: "hsl(var(--muted))",
      },
      fontFamily: {
        sans: ['"DM Sans"', "-apple-system", "BlinkMacSystemFont", "Segoe UI", "sans-serif"],
      },
      borderRadius: {
        lg: "var(--radius)",
      },
      maxWidth: {
        app: "28rem",
      },
    },
  },
  plugins: [],
} satisfies Config;
