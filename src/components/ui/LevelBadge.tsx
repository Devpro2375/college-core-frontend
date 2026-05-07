interface LevelBadgeProps {
  level: string;
}

const LEVEL_COLORS: Record<string, string> = {
  Beginner: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/30',
  Intermediate: 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/30',
  Advanced: 'bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-500/30',
};

export default function LevelBadge({ level }: LevelBadgeProps) {
  return (
    <span
      className={`px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider border ${
        LEVEL_COLORS[level] || LEVEL_COLORS.Beginner
      }`}
    >
      {level}
    </span>
  );
}
