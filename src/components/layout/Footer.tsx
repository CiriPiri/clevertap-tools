import { motion } from "framer-motion";

export const Footer = () => (
  <motion.footer
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ delay: 0.4, duration: 0.5 }}
    className="mt-16 border-t border-zinc-200 dark:border-zinc-800 transition-colors duration-500"
  >
    <div className="max-w-400 mx-auto px-8 py-6 flex items-center justify-center text-xs text-zinc-500 dark:text-zinc-500">
      <span className="inline-flex items-center gap-1.5 flex-wrap justify-center">
        Created with
        <motion.span
          aria-hidden
          animate={{ scale: [1, 1.18, 1] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          className="inline-block text-rose-500 dark:text-rose-400"
        >
          ♥
        </motion.span>
        by
        <a
          href="https://github.com/Ciriously"
          target="_blank"
          rel="noopener noreferrer"
          className="group inline-flex items-center gap-1 font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-300 dark:hover:text-indigo-200 transition-colors"
        >
          Aditya Mishra
          <span
            className="inline-block transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110"
            aria-hidden
          >
            🐾
          </span>
        </a>
        <span aria-hidden className="ml-0.5">
          🐱
        </span>
      </span>
    </div>
  </motion.footer>
);
