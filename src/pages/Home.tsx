import { Link } from "react-router-dom";
import { ArrowRight, ShieldCheck, Zap, ClipboardCheck } from "lucide-react";
import { tools } from "../config/tools";
import { Badge, Label } from "../components/ui";
import { cx } from "../components/ui/tokens";

/**
 * Entrances here are CSS classes (`.enter` + `.enter-d*`), not Framer
 * Motion. The resting state is visible, so the page still reads correctly
 * if the animation never plays. See index.css.
 */
export const Home = () => (
  <div className="flex flex-col gap-16 pb-20">
    <Hero />
    <ToolGrid />
    <Principles />
  </div>
);

/* ------------------------------------------------------------------ */
/* Hero                                                                */
/* ------------------------------------------------------------------ */

const Hero = () => (
  <section className="relative pt-10 sm:pt-16">
    {/* A single soft wash rather than competing gradient orbs — it adds
        depth without pulling focus off the headline. */}
    <div
      aria-hidden
      className="pointer-events-none absolute inset-x-0 -top-24 h-80 opacity-60 dark:opacity-40 mask-[radial-gradient(60%_60%_at_50%_40%,black,transparent)] bg-[radial-gradient(50%_50%_at_50%_50%,var(--color-accent-200),transparent)] dark:bg-[radial-gradient(50%_50%_at_50%_50%,var(--color-accent-600),transparent)]"
    />

    <div className="relative max-w-3xl">
      <div className="enter">
        <Badge tone="accent" className="px-2 py-1">
          <span className="relative flex w-1.5 h-1.5">
            <span className="absolute inline-flex w-full h-full rounded-full bg-accent-500 opacity-60 animate-ping" />
            <span className="relative inline-flex w-1.5 h-1.5 rounded-full bg-accent-500" />
          </span>
          {tools.length} tools · runs entirely in your browser
        </Badge>
      </div>

      <h1 className="enter enter-d1 mt-5 text-[40px] sm:text-[52px] font-semibold tracking-[-0.03em] leading-[1.05] text-zinc-900 dark:text-zinc-50">
        The utility belt for
        <br />
        CleverTap payloads.
      </h1>

      <p className="enter enter-d2 mt-5 text-[15px] sm:text-base leading-relaxed max-w-xl text-zinc-600 dark:text-zinc-400">
        Parse exports, decode notification logs, and convert timestamps — then
        copy the result straight into Slack, an email, or a spreadsheet. No
        upload, no account, no data leaving your machine.
      </p>

      <div className="enter enter-d3 mt-8 flex flex-wrap items-center gap-2.5">
        <Link
          to={`/${tools[0].slug}`}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-[13px] font-medium transition-colors bg-zinc-900 text-white hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white"
        >
          Open {tools[0].name}
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
        <a
          href="https://github.com/Ciriously"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-[13px] font-medium border transition-colors bg-white text-zinc-700 border-zinc-200 hover:bg-zinc-50 dark:bg-zinc-900 dark:text-zinc-300 dark:border-zinc-800 dark:hover:bg-zinc-800"
        >
          View source
        </a>
      </div>
    </div>
  </section>
);

/* ------------------------------------------------------------------ */
/* Tool grid                                                           */
/* ------------------------------------------------------------------ */

const DELAYS = ["enter-d1", "enter-d2", "enter-d3", "enter-d4", "enter-d5"];

const ToolGrid = () => (
  <section>
    <div className="flex items-center gap-3 mb-4">
      <Label>Tools</Label>
      <div className="h-px flex-1 bg-zinc-200 dark:bg-zinc-800" />
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
      {tools.map((tool, i) => (
        <Link
          key={tool.slug}
          to={`/${tool.slug}`}
          className={cx(
            "enter group relative flex flex-col h-full p-5 rounded-xl border transition-all duration-200",
            "bg-white border-zinc-200 hover:border-zinc-300 hover:shadow-[0_1px_3px_rgba(0,0,0,0.04),0_8px_24px_-8px_rgba(0,0,0,0.10)]",
            "dark:bg-zinc-900/40 dark:border-zinc-800 dark:hover:border-zinc-700 dark:hover:bg-zinc-900/70",
            DELAYS[i % DELAYS.length],
          )}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center border transition-colors bg-zinc-50 border-zinc-200 text-zinc-600 group-hover:border-accent-200 group-hover:bg-accent-50 group-hover:text-accent-600 dark:bg-zinc-800/60 dark:border-zinc-700/60 dark:text-zinc-400 dark:group-hover:bg-accent-500/10 dark:group-hover:border-accent-500/30 dark:group-hover:text-accent-300">
              <tool.icon className="w-4 h-4" />
            </div>
            <ArrowRight className="w-4 h-4 transition-all duration-200 text-zinc-300 group-hover:text-zinc-600 group-hover:translate-x-0.5 dark:text-zinc-700 dark:group-hover:text-zinc-300" />
          </div>

          <h3 className="text-[14px] font-semibold text-zinc-900 dark:text-zinc-100">
            {tool.name}
          </h3>
          <p className="mt-1 text-[12px] text-zinc-500 dark:text-zinc-500">
            {tool.tagline}
          </p>
          <p className="mt-3 text-[13px] leading-relaxed text-zinc-600 dark:text-zinc-400">
            {tool.description}
          </p>
        </Link>
      ))}
    </div>
  </section>
);

/* ------------------------------------------------------------------ */
/* Principles                                                          */
/* ------------------------------------------------------------------ */

const PRINCIPLES = [
  {
    icon: ShieldCheck,
    title: "Nothing leaves the browser",
    body: "Every parse, decode, and conversion runs locally. There is no backend to send data to.",
  },
  {
    icon: Zap,
    title: "Live as you type",
    body: "Input parses on every keystroke. No submit button, no spinner, no round trip.",
  },
  {
    icon: ClipboardCheck,
    title: "Paste-ready output",
    body: "Copy targets the app you're pasting into — rich HTML for email, monospace for Slack.",
  },
];

const Principles = () => (
  <section>
    <div className="flex items-center gap-3 mb-4">
      <Label>Principles</Label>
      <div className="h-px flex-1 bg-zinc-200 dark:bg-zinc-800" />
    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
      {PRINCIPLES.map((p, i) => (
        <div
          key={p.title}
          className={cx(
            "enter p-5 rounded-xl border bg-white border-zinc-200 dark:bg-zinc-900/40 dark:border-zinc-800",
            DELAYS[i % DELAYS.length],
          )}
        >
          <p.icon className="w-4 h-4 text-zinc-400 dark:text-zinc-500" />
          <h3 className="mt-3 text-[13px] font-semibold text-zinc-900 dark:text-zinc-100">
            {p.title}
          </h3>
          <p className="mt-1.5 text-[12.5px] leading-relaxed text-zinc-600 dark:text-zinc-400">
            {p.body}
          </p>
        </div>
      ))}
    </div>
  </section>
);
