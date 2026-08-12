import type { LucideIcon } from "lucide-react";
import { cx } from "./tokens";

/**
 * Shared primitives. Every page composes from these so a change to the
 * button radius or panel border happens in exactly one place.
 *
 * Design contract (keep these consistent everywhere):
 *   body text   13px      labels 11px uppercase/wider
 *   radius      lg (8px) for controls, xl (12px) for panels
 *   borders     hairline zinc-200 / zinc-800
 *   accent      accent-* ramp only; semantic colours for state only
 *
 * `cx` and the motion presets live in ./tokens — import them from there.
 */

/* ------------------------------------------------------------------ */
/* Button                                                              */
/* ------------------------------------------------------------------ */

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
type ButtonSize = "sm" | "md";

const BUTTON_VARIANTS: Record<ButtonVariant, string> = {
  primary:
    "bg-zinc-900 text-white hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white",
  secondary:
    "bg-white text-zinc-700 border border-zinc-200 hover:bg-zinc-50 hover:text-zinc-900 dark:bg-zinc-900 dark:text-zinc-300 dark:border-zinc-800 dark:hover:bg-zinc-800 dark:hover:text-zinc-100",
  ghost:
    "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100",
  danger:
    "bg-white text-zinc-700 border border-zinc-200 hover:border-rose-300 hover:text-rose-600 dark:bg-zinc-900 dark:text-zinc-300 dark:border-zinc-800 dark:hover:border-rose-500/40 dark:hover:text-rose-400",
};

const BUTTON_SIZES: Record<ButtonSize, string> = {
  sm: "gap-1.5 px-2 py-1 text-[11px] rounded-md",
  md: "gap-2 px-3 py-2 text-[13px] rounded-lg",
};

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: LucideIcon;
}

export const Button = ({
  variant = "secondary",
  size = "md",
  icon: Icon,
  className,
  children,
  ...props
}: ButtonProps) => (
  <button
    {...props}
    className={cx(
      "inline-flex items-center justify-center font-medium transition-colors duration-150",
      "disabled:opacity-40 disabled:pointer-events-none",
      BUTTON_SIZES[size],
      BUTTON_VARIANTS[variant],
      className,
    )}
  >
    {Icon && <Icon className={size === "sm" ? "w-3 h-3" : "w-3.5 h-3.5"} />}
    {children}
  </button>
);

/* ------------------------------------------------------------------ */
/* Panel — the standard bordered surface                               */
/* ------------------------------------------------------------------ */

export const Panel = ({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    {...props}
    className={cx(
      "rounded-xl border bg-white border-zinc-200 dark:bg-zinc-900/40 dark:border-zinc-800",
      className,
    )}
  >
    {children}
  </div>
);

/* ------------------------------------------------------------------ */
/* Label — the 11px uppercase section marker                           */
/* ------------------------------------------------------------------ */

export const Label = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => (
  <span
    className={cx(
      "text-[11px] font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-500",
      className,
    )}
  >
    {children}
  </span>
);

/* ------------------------------------------------------------------ */
/* Badge                                                               */
/* ------------------------------------------------------------------ */

type BadgeTone = "neutral" | "accent" | "success" | "warning" | "danger";

const BADGE_TONES: Record<BadgeTone, string> = {
  neutral:
    "bg-zinc-100 text-zinc-600 border-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:border-zinc-700",
  accent:
    "bg-accent-50 text-accent-700 border-accent-200 dark:bg-accent-500/15 dark:text-accent-300 dark:border-accent-500/30",
  success:
    "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/30",
  warning:
    "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/30",
  danger:
    "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/30",
};

export const Badge = ({
  tone = "neutral",
  className,
  children,
}: {
  tone?: BadgeTone;
  className?: string;
  children: React.ReactNode;
}) => (
  <span
    className={cx(
      "inline-flex items-center gap-1 px-1.5 py-0.5 rounded border text-[10px] font-medium",
      BADGE_TONES[tone],
      className,
    )}
  >
    {children}
  </span>
);

/* ------------------------------------------------------------------ */
/* PageHeader — identical title block on every tool page               */
/* ------------------------------------------------------------------ */

export const PageHeader = ({
  title,
  description,
  actions,
}: {
  title: string;
  description: string;
  actions?: React.ReactNode;
}) => (
  <div className="flex items-start justify-between gap-4 flex-wrap mb-5">
    <div className="min-w-0">
      <h1 className="text-[22px] font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
        {title}
      </h1>
      <p className="text-[13px] mt-1 max-w-2xl text-zinc-500 dark:text-zinc-400">
        {description}
      </p>
    </div>
    {actions && <div className="flex items-center gap-2">{actions}</div>}
  </div>
);

/* ------------------------------------------------------------------ */
/* EmptyState                                                          */
/* ------------------------------------------------------------------ */

export const EmptyState = ({
  icon: Icon,
  title,
  body,
}: {
  icon: LucideIcon;
  title: string;
  body: React.ReactNode;
}) => (
  <div className="flex flex-col items-center justify-center gap-3 text-center px-6 py-14">
    <div className="w-11 h-11 rounded-xl flex items-center justify-center border bg-zinc-50 border-zinc-200 dark:bg-zinc-800/40 dark:border-zinc-700/50">
      <Icon className="w-5 h-5 text-zinc-400 dark:text-zinc-600" />
    </div>
    <div>
      <p className="text-[13px] font-medium text-zinc-700 dark:text-zinc-300">
        {title}
      </p>
      <p className="text-[12px] mt-0.5 max-w-sm text-zinc-500 dark:text-zinc-500">
        {body}
      </p>
    </div>
  </div>
);

/* ------------------------------------------------------------------ */
/* ErrorNote                                                           */
/* ------------------------------------------------------------------ */

export const ErrorNote = ({
  icon: Icon,
  title,
  detail,
}: {
  icon: LucideIcon;
  title: string;
  detail?: string;
}) => (
  <div className="flex items-start gap-2 px-3 py-2 rounded-lg border text-[12px] bg-rose-50 border-rose-200 text-rose-700 dark:bg-rose-500/10 dark:border-rose-500/25 dark:text-rose-400">
    <Icon className="w-3.5 h-3.5 shrink-0 mt-0.5" />
    <div className="min-w-0">
      <div className="font-medium">{title}</div>
      {detail && <div className="mt-0.5 font-mono opacity-90">{detail}</div>}
    </div>
  </div>
);
