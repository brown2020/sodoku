// tailwind.config.ts
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      keyframes: {
        "number-enter": {
          "0%": { transform: "scale(0.8)", opacity: "0" },
          "50%": { transform: "scale(1.1)" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        "circle-out": {
          "0%": { transform: "scale(0.3)", opacity: "1" },
          "100%": { transform: "scale(2)", opacity: "0" },
        },
        shake: {
          "0%, 100%": { transform: "translateX(0)" },
          "25%": { transform: "translateX(-2px)" },
          "75%": { transform: "translateX(2px)" },
        },
        "success-cell": {
          "0%": { backgroundColor: "rgb(134, 239, 172)" }, // green-300
          "100%": { backgroundColor: "rgb(255, 255, 255)" }, // white
        },
        mistake: {
          "0%": {
            transform: "scale(1)",
            backgroundColor: "rgb(254, 202, 202)",
          },
          "50%": {
            transform: "scale(1.1)",
            backgroundColor: "rgb(252, 165, 165)",
          },
          "100%": {
            transform: "scale(1)",
            backgroundColor: "rgb(254, 202, 202)",
          },
        },
      },
      animation: {
        "number-enter": "number-enter 0.3s ease-out",
        "circle-out": "circle-out 0.4s ease-out forwards",
        shake: "shake 0.2s ease-in-out 3",
        "success-cell": "success-cell 1s ease-out",
        mistake: "mistake 0.3s ease-in-out",
      },
    },
  },
  plugins: [],
};

export default config;
