import React from "react";
import { Logo } from "./logo";
import { Twitter, Instagram, Linkedin, Github } from "lucide-react";

export const Footer: React.FC = () => {
  return (
    <div className="flex flex-col sm:flex-row items-center sm:items-end justify-between text-xs sm:text-sm text-neutral-600 gap-8 sm:gap-4">
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6">
        <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl bg-neutral-900">
          <Logo className="h-6 sm:h-8 w-auto text-white" />
        </div>
        <p className="max-w-xl text-center sm:text-left text-sm sm:text-base">
          Transforming digital experiences through blockchain, GameFi, and Web3
          technologies.
        </p>
      </div>
      <div className="flex gap-6">
        <a
          href="#"
          className="text-neutral-600 transition-colors hover:text-neutral-900"
        >
          <Twitter size={20} className="sm:w-6 sm:h-6" />
          <span className="sr-only">Twitter</span>
        </a>
        <a
          href="#"
          className="text-neutral-600 transition-colors hover:text-neutral-900"
        >
          <Instagram size={20} className="sm:w-6 sm:h-6" />
          <span className="sr-only">Instagram</span>
        </a>
        <a
          href="#"
          className="text-neutral-600 transition-colors hover:text-neutral-900"
        >
          <Linkedin size={20} className="sm:w-6 sm:h-6" />
          <span className="sr-only">LinkedIn</span>
        </a>
        <a
          href="#"
          className="text-neutral-600 transition-colors hover:text-neutral-900"
        >
          <Github size={20} className="sm:w-6 sm:h-6" />
          <span className="sr-only">GitHub</span>
        </a>
      </div>
    </div>
  );
};
