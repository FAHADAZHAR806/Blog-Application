import type { Config } from "tailwindcss";
import typography from "@tailwindcss/typography"; // Import for cleaner syntax

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],

  theme: {
    extend: {
      colors: {
        surface: {
          DEFAULT: "#FEF7FF", // M3 Surface
          container: "#F3EDF7", // M3 Surface Container
          variant: "#E7E0EC",
        },
        primary: {
          DEFAULT: "#6750A4", // M3 Primary
          content: "#FFFFFF",
        },
        secondary: "#625B71",
      },
      borderRadius: {
        "md-3": "28px", // M3 Extra Large Rounded for Cards
      },
      boxShadow: {
        "m3-1":
          "0px 1px 3px 1px rgba(0, 0, 0, 0.15), 0px 1px 2px 0px rgba(0, 0, 0, 0.30)",
        "m3-2":
          "0px 2px 6px 2px rgba(0, 0, 0, 0.15), 0px 1px 2px 0px rgba(0, 0, 0, 0.30)",
      },
    },
  },
  plugins: [
    typography, // Correct way to add the typography plugin
  ],
};

export default config;
