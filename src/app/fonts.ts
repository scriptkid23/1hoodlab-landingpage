import localFont from "next/font/local";
import { Inter } from "next/font/google";

export const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter", // Optional: Define a custom CSS variable
  display: "swap", // Optimize loading behavior
});

export const polySans = localFont({
  src: [
    {
      path: "./fonts/PolySans/PolySans-Bulky.ttf",
      weight: "700",
      style: "normal",
    },
    {
      path: "./fonts/PolySans/PolySans-BulkyItalic.ttf",
      weight: "700",
      style: "italic",
    },
    {
      path: "./fonts/PolySans/PolySans-MedianItalic.ttf",
      weight: "500",
      style: "italic",
    },
    {
      path: "./fonts/PolySans/PolySans-Neutral.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "./fonts/PolySans/PolySans-NeutralItalic.ttf",
      weight: "400",
      style: "italic",
    },
    {
      path: "./fonts/PolySans/PolySans-Slim.ttf",
      weight: "300",
      style: "normal",
    },
    {
      path: "./fonts/PolySans/PolySans-SlimItalic.ttf",
      weight: "300",
      style: "italic",
    },
  ],
  variable: "--font-polySans", // Custom CSS variable for this font
  display: "swap", // Optional, controls font loading behavior
});
