import type { Metadata } from "next";
import { Geist, Geist_Mono, Lato } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});
const lato = Lato({
  weight: ['400', '700'],
  subsets: ["latin"],
  variable: "--font-lato",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "1hoodlabs | Transforming Digital Experiences",
  description:
    "1hoodlabs is at the forefront of blockchain, GameFi, and Web3 technologies, revolutionizing digital experiences through innovative solutions.",
  keywords: [
    "Blockchain",
    "Frontend",
    "GameFi",
    "Web3",
    "DeFi",
    "NFT",
    "Metaverse",
    "AI",
    "IoT",
  ],
  authors: [{ name: "1hoodlabs Team" }],
  creator: "1hoodlabs",
  publisher: "1hoodlabs",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://1hoodlabs.xyz",
    siteName: "1hoodlabs",
    title: "1hoodlabs | Transforming Digital Experiences",
    description:
      "Revolutionizing digital experiences through blockchain, GameFi, and Web3 technologies.",
    images: [
      {
        url: "https://1hoodlabs.xyz/icon.svg",
        width: 1200,
        height: 630,
        alt: "1hoodlabs - Transforming Digital Experiences",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@1hoodlabs",
    creator: "@1hoodlabs",
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${lato.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
