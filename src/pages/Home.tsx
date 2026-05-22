import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles, ShieldCheck, Zap } from "lucide-react";
import { tools } from "../config/tools";
import { BrandMark } from "../components/layout/BrandMark";

export const Home = () => {
  return (
    <div className="flex flex-col gap-14 pb-16">
      <Hero />

      <section className="flex flex-col gap-5">
        <div className="flex items-end justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-300" />
            <h3 className="text-sm font-semibold uppercase tracking-widest text-zinc-700 dark:text-zinc-300">
              Tools
            </h3>
            <span className="text-xs text-zinc-500 dark:text-zinc-500">
              {tools.length} available
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {tools.map((tool, i) => (
            <ToolCard key={tool.slug} tool={tool} index={i} />
          ))}
        </div>
      </section>

      <FeatureStrip />
    </div>
  );
};

const Hero = () => (
  <motion.section
    initial={{ y: 24, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    transition={{ duration: 0.5, ease: "easeOut" }}
    className="relative overflow-hidden rounded-3xl border bg-white border-zinc-200 px-8 py-12 sm:px-12 sm:py-16 dark:bg-zinc-900/40 dark:border-zinc-800"
  >
    <div
      aria-hidden
      className="absolute -top-24 -right-24 w-96 h-96 rounded-full blur-3xl opacity-30 dark:opacity-40 bg-linear-to-br from-indigo-400 via-violet-400 to-fuchsia-400"
    />
    <div
      aria-hidden
      className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full blur-3xl opacity-25 dark:opacity-30 bg-linear-to-br from-sky-300 via-indigo-300 to-violet-300"
    />

    <div className="relative flex flex-col gap-6 max-w-3xl">
      <motion.div
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.4, type: "spring", stiffness: 140 }}
        className="flex items-center gap-3"
      >
        <BrandMark size={48} className="drop-shadow-md" />
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold uppercase tracking-widest bg-indigo-100 text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-300">
          <Sparkles className="w-3 h-3" /> CleverTap Toolbox
        </span>
      </motion.div>

      <motion.h2
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.15 }}
        className="text-4xl sm:text-5xl font-semibold tracking-tight leading-[1.05] text-zinc-900 dark:text-zinc-50"
      >
        Small tools.{" "}
        <span className="bg-clip-text text-transparent bg-linear-to-r from-indigo-600 via-violet-500 to-fuchsia-500 dark:from-indigo-400 dark:via-violet-300 dark:to-fuchsia-300">
          Big leverage.
        </span>
      </motion.h2>

      <motion.p
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.22 }}
        className="text-base sm:text-lg max-w-xl text-zinc-600 dark:text-zinc-300"
      >
        A growing collection of lightweight, client-side utilities for parsing
        payloads, decoding logs, and reshaping data. Everything runs in your
        browser — nothing leaves your machine.
      </motion.p>

      <motion.div
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="flex flex-wrap items-center gap-2"
      >
        {tools.slice(0, 3).map((t) => (
          <Link
            key={t.slug}
            to={`/${t.slug}`}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border bg-white border-zinc-200 text-zinc-700 hover:border-indigo-300 hover:text-indigo-700 dark:bg-zinc-900/60 dark:border-zinc-700 dark:text-zinc-300 dark:hover:border-indigo-400/60 dark:hover:text-indigo-200 transition-colors"
          >
            <t.icon className="w-3.5 h-3.5" />
            {t.name}
          </Link>
        ))}
      </motion.div>
    </div>
  </motion.section>
);

interface ToolCardProps {
  tool: (typeof tools)[number];
  index: number;
}
const ToolCard = ({ tool, index }: ToolCardProps) => (
  <motion.div
    initial={{ y: 20, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    transition={{ delay: 0.05 * index, duration: 0.35, ease: "easeOut" }}
    whileHover={{ y: -4 }}
    className="h-full"
  >
    <Link
      to={`/${tool.slug}`}
      className="group relative block h-full p-6 rounded-2xl overflow-hidden border bg-white border-zinc-200 shadow-sm hover:shadow-lg hover:border-indigo-300 dark:bg-zinc-900/50 dark:border-zinc-800 dark:shadow-none dark:hover:border-indigo-400/40 dark:hover:bg-zinc-900/80 transition-all"
    >
      <div
        aria-hidden
        className="absolute -top-12 -right-12 w-40 h-40 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-linear-to-br from-indigo-300 to-violet-300 dark:from-indigo-500/30 dark:to-violet-500/30"
      />

      <div className="relative flex items-start justify-between mb-5">
        <div className="bg-linear-to-br from-indigo-100 to-violet-100 p-2.5 rounded-xl border border-indigo-200 dark:from-indigo-500/20 dark:to-violet-500/15 dark:border-indigo-500/30">
          <tool.icon className="w-5 h-5 text-indigo-600 dark:text-indigo-300" />
        </div>
        <ArrowRight className="w-4 h-4 text-zinc-400 group-hover:text-indigo-600 group-hover:translate-x-1 dark:text-zinc-600 dark:group-hover:text-indigo-300 transition-all" />
      </div>

      <h3 className="relative text-base font-semibold mb-1 text-zinc-900 dark:text-zinc-100">
        {tool.name}
      </h3>
      <p className="relative text-[11px] uppercase tracking-wider mb-3 text-indigo-600/80 dark:text-indigo-300/80">
        {tool.tagline}
      </p>
      <p className="relative text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
        {tool.description}
      </p>
    </Link>
  </motion.div>
);

const FEATURES = [
  {
    icon: ShieldCheck,
    title: "Client-side only",
    body: "Your data never leaves the browser. No server, no logging, no tracking.",
  },
  {
    icon: Zap,
    title: "Instant feedback",
    body: "Every input parses live as you type. No submit buttons, no waiting.",
  },
  {
    icon: Sparkles,
    title: "Built for copy-paste",
    body: "Every output has a one-click copy that matches exactly what you see.",
  },
];

const FeatureStrip = () => (
  <motion.section
    initial={{ y: 20, opacity: 0 }}
    whileInView={{ y: 0, opacity: 1 }}
    viewport={{ once: true, margin: "-80px" }}
    transition={{ duration: 0.4 }}
    className="grid grid-cols-1 md:grid-cols-3 gap-4"
  >
    {FEATURES.map((f) => (
      <div
        key={f.title}
        className="flex items-start gap-3 p-5 rounded-2xl border bg-white border-zinc-200 dark:bg-zinc-900/40 dark:border-zinc-800"
      >
        <div className="shrink-0 p-2 rounded-lg bg-indigo-100 text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-300">
          <f.icon className="w-4 h-4" />
        </div>
        <div className="flex flex-col gap-1 min-w-0">
          <div className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
            {f.title}
          </div>
          <div className="text-xs leading-relaxed text-zinc-600 dark:text-zinc-400">
            {f.body}
          </div>
        </div>
      </div>
    ))}
  </motion.section>
);
