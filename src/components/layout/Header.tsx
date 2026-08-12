import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import { tools } from "../../config/tools";
import { ThemeToggle } from "./ThemeToggle";
import { BrandMark } from "./BrandMark";

export const Header = () => (
  <header className="sticky top-0 z-20 border-b bg-white/85 border-zinc-200 backdrop-blur-xl dark:bg-zinc-950/85 dark:border-zinc-800/80">
    <div className="max-w-360 mx-auto px-6 h-14 flex items-center justify-between gap-4">
      <NavLink to="/" className="flex items-center gap-2.5 shrink-0 group">
        <BrandMark size={24} />
        <span className="text-[14px] font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
          CleverTap{" "}
          <span className="font-normal text-zinc-400 dark:text-zinc-500">
            Toolbox
          </span>
        </span>
      </NavLink>

      <div className="flex items-center gap-1">
        <nav className="hidden sm:flex items-center gap-0.5">
          {tools.map((tool) => (
            <NavLink
              key={tool.slug}
              to={`/${tool.slug}`}
              className={({ isActive }) =>
                `relative flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[12.5px] font-medium transition-colors ${
                  isActive
                    ? "text-zinc-900 dark:text-zinc-100"
                    : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {/* Shared layout id makes the active pill glide between
                      items rather than blink on/off. */}
                  {isActive && (
                    <motion.span
                      layoutId="nav-active"
                      transition={{
                        type: "spring",
                        stiffness: 380,
                        damping: 32,
                      }}
                      className="absolute inset-0 rounded-lg bg-zinc-100 dark:bg-zinc-800"
                    />
                  )}
                  <tool.icon className="relative w-3.5 h-3.5" />
                  <span className="relative">{tool.name}</span>
                </>
              )}
            </NavLink>
          ))}
        </nav>
        <div className="w-px h-5 mx-1 bg-zinc-200 dark:bg-zinc-800" />
        <ThemeToggle />
      </div>
    </div>
  </header>
);
