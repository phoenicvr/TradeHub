import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
        // Trading theme colors
        trading: {
          primary: "hsl(var(--trading-primary))",
          secondary: "hsl(var(--trading-secondary))",
          accent: "hsl(var(--trading-accent))",
          success: "hsl(var(--trading-success))",
          warning: "hsl(var(--trading-warning))",
          danger: "hsl(var(--trading-danger))",
        },
        rarity: {
          common: "hsl(var(--rarity-common))",
          uncommon: "hsl(var(--rarity-uncommon))",
          rare: "hsl(var(--rarity-rare))",
          legendary: "hsl(var(--rarity-legendary))",
          mythic: "hsl(var(--rarity-mythic))",
          divine: "hsl(var(--rarity-divine))",
          prismatic: "hsl(var(--rarity-prismatic))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        xl: "calc(var(--radius) + 4px)",
        "2xl": "calc(var(--radius) + 8px)",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "trading-gradient":
          "linear-gradient(135deg, hsl(var(--trading-primary)), hsl(var(--trading-secondary)))",
        "rarity-common":
          "linear-gradient(135deg, hsl(var(--rarity-common)), hsl(var(--rarity-common) / 0.8))",
        "rarity-uncommon":
          "linear-gradient(135deg, hsl(var(--rarity-uncommon)), hsl(var(--rarity-uncommon) / 0.8))",
        "rarity-rare":
          "linear-gradient(135deg, hsl(var(--rarity-rare)), hsl(var(--rarity-rare) / 0.8))",
        "rarity-legendary":
          "linear-gradient(135deg, hsl(var(--rarity-legendary)), hsl(var(--rarity-legendary) / 0.8))",
        "rarity-mythic":
          "linear-gradient(135deg, hsl(var(--rarity-mythic)), hsl(var(--rarity-mythic) / 0.8))",
        "rarity-divine":
          "linear-gradient(135deg, hsl(var(--rarity-divine)), hsl(var(--rarity-divine) / 0.8))",
        "rarity-prismatic":
          "linear-gradient(135deg, hsl(var(--rarity-prismatic)), hsl(var(--rarity-prismatic) / 0.8))",
      },
      boxShadow: {
        glow: "0 0 20px hsl(var(--trading-accent) / 0.5)",
        "glow-lg": "0 0 40px hsl(var(--trading-accent) / 0.3)",
        "rarity-glow": "0 0 20px currentColor",
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        glow: {
          "0%, 100%": {
            boxShadow: "0 0 20px hsl(var(--trading-accent) / 0.5)",
          },
          "50%": { boxShadow: "0 0 40px hsl(var(--trading-accent) / 0.8)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        float: "float 3s ease-in-out infinite",
        glow: "glow 2s ease-in-out infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
