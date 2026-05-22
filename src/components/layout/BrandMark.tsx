interface BrandMarkProps {
  className?: string;
  size?: number;
}

export const BrandMark = ({ className = "", size = 28 }: BrandMarkProps) => (
  <svg
    viewBox="0 0 64 64"
    width={size}
    height={size}
    className={className}
    aria-hidden
  >
    <defs>
      <linearGradient id="brand-mark-gradient" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#6366f1" />
        <stop offset="60%" stopColor="#8b5cf6" />
        <stop offset="100%" stopColor="#a855f7" />
      </linearGradient>
    </defs>
    <rect x="2" y="2" width="60" height="60" rx="14" fill="url(#brand-mark-gradient)" />
    <path
      d="M16 22 h32 a4 4 0 0 1 4 4 v18 a4 4 0 0 1 -4 4 H16 a4 4 0 0 1 -4 -4 V26 a4 4 0 0 1 4 -4 z"
      fill="none"
      stroke="white"
      strokeWidth="3"
      strokeLinejoin="round"
      opacity="0.95"
    />
    <path
      d="M24 22 v-4 a3 3 0 0 1 3 -3 h10 a3 3 0 0 1 3 3 v4"
      fill="none"
      stroke="white"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      opacity="0.95"
    />
    <rect x="29" y="30" width="6" height="10" rx="1.5" fill="white" opacity="0.95" />
  </svg>
);
