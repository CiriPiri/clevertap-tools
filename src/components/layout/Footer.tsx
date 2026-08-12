import { ShieldCheck } from "lucide-react";

export const Footer = () => (
  <footer className="border-t border-zinc-200 dark:border-zinc-800/80">
    <div className="max-w-360 mx-auto px-6 py-5 flex items-center justify-between gap-4 flex-wrap text-[12px] text-zinc-500 dark:text-zinc-500">
      <span className="inline-flex items-center gap-1.5">
        <ShieldCheck className="w-3.5 h-3.5" />
        Client-side only — nothing you paste leaves this browser.
      </span>

      <span>
        Built by{" "}
        <a
          href="https://github.com/Ciriously"
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium transition-colors text-zinc-700 hover:text-accent-600 dark:text-zinc-300 dark:hover:text-accent-300"
        >
          Aditya Mishra
        </a>
      </span>
    </div>
  </footer>
);
