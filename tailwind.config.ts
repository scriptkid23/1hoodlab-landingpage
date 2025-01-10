import type { Config } from "tailwindcss";
const { nextui } = require("@nextui-org/react");

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        polySans: ["var(--font-polySans)"],
        inter: ["var(--font-inter)"],
      },

      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        white: {
          "50": "#ffffff",
          "100": "#efefef",
          "200": "#dcdcdc",
          "300": "#bdbdbd",
          "400": "#989898",
          "500": "#7c7c7c",
          "600": "#656565",
          "700": "#525252",
          "800": "#464646",
          "900": "#3d3d3d",
          "950": "#292929",
        },
        blue: {
          "50": "#eff3ff",
          "100": "#dbe4fe",
          "200": "#bfd0fe",
          "300": "#93affd",
          "400": "#6088fa",
          "500": "#3b6cf6",
          "600": "#2559eb",
          "700": "#1d4ed8",
          "800": "#1e44af",
          "900": "#1e3a8a",
          "950": "#172754",
        },

        black: {
          "50": "#f6f6f6",
          "100": "#e7e7e7",
          "200": "#d1d1d1",
          "300": "#b0b0b0",
          "400": "#888888",
          "500": "#6d6d6d",
          "600": "#5d5d5d",
          "700": "#4f4f4f",
          "800": "#454545",
          "900": "#3d3d3d",
          "950": "#000000",
        },
      },
    },
  },
  plugins: [nextui()],
} satisfies Config;
