"use client";

import { LabHeader } from "../components/LabHeader";

export default function LabHeadersPage() {
  return (
    <div className="min-h-[300vh] bg-[#111] text-[#e7e7e7]">
      <LabHeader />

      {/* Demo content to test scroll behavior */}
      <div className="flex min-h-screen items-center justify-center pt-[var(--header-height)]">
        <h1
          className="text-4xl font-light tracking-tight"
          style={{ fontFamily: "var(--font-clash-display)" }}
        >
          Lab Headers
        </h1>
      </div>
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-lg opacity-40">Scroll to test header behavior</p>
      </div>
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-lg opacity-40">Keep scrolling...</p>
      </div>
    </div>
  );
}
