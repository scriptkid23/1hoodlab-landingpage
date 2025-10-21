"use client";
import { PageTransitionProvider } from "@/components/PageTransition";

export default function Template({ children }: { children: React.ReactNode }) {
  return <PageTransitionProvider>{children}</PageTransitionProvider>;
}

