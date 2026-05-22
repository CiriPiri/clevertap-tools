import { motion } from "framer-motion";
import { NavLink } from "react-router-dom";
import { tools } from "../../config/tools";
import { ThemeToggle } from "./ThemeToggle";
import { BrandMark } from "./BrandMark";

export const Header = () => {
  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="sticky top-0 z-10 border-b border-zinc-200 bg-white/80 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-950/80 transition-colors duration-500"
    >
      <div
        aria-hidden
        className="header-gradient absolute inset-0 -z-10 opacity-30 dark:opacity-40 bg-linear-to-r from-indigo-200 via-violet-200 to-sky-200 dark:from-indigo-500/20 dark:via-violet-500/15 dark:to-emerald-500/10"
      />
      <div className="max-w-400 mx-auto px-8 py-5 flex justify-between items-center gap-4">
        <NavLink to="/" className="flex items-center gap-3 shrink-0 group">
          <BrandMark size={32} className="drop-shadow-sm transition-transform duration-300 group-hover:rotate-3" />
          <h1 className="text-lg font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
            CleverTap{" "}
            <span className="font-normal text-zinc-500 dark:text-zinc-500">
              Toolbox
            </span>
          </h1>
        </NavLink>

        <div className="flex items-center gap-2 flex-wrap justify-end">
          <nav className="flex items-center gap-1">
            {tools.map((tool) => (
              <NavLink
                key={tool.slug}
                to={`/${tool.slug}`}
                className={({ isActive }) =>
                  `flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-colors border ${
                    isActive
                      ? "bg-indigo-100 text-indigo-700 border-indigo-200 dark:bg-indigo-500/15 dark:text-indigo-300 dark:border-indigo-500/30"
                      : "bg-transparent border-transparent text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800/60 dark:hover:text-zinc-200"
                  }`
                }
              >
                <tool.icon className="w-3.5 h-3.5" />
                {tool.name}
              </NavLink>
            ))}
          </nav>
          <ThemeToggle />
        </div>
      </div>
    </motion.header>
  );
};
