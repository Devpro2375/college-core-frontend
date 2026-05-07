export const LEVELS = ['Beginner', 'Intermediate', 'Advanced'] as const;

export const SEMESTERS = [1, 2, 3, 4, 5, 6, 7, 8] as const;

export const YEARS = [2024, 2023, 2022, 2021] as const;

export const EXAM_TYPES = ['Final', 'Midterm', 'Quiz'] as const;

export const EVENT_TYPES = ['Workshop', 'Hackathon', 'Seminar', 'Competition', 'Career', 'Event'] as const;

export const SORT_OPTIONS = [
  { value: 'ai_score', label: 'AI Score' },
  { value: 'views', label: 'Most Viewed' },
  { value: 'likes', label: 'Most Liked' },
  { value: 'created_at', label: 'Newest' },
] as const;

export const EVENT_TYPE_COLORS: Record<string, string> = {
  Workshop: 'bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/30',
  Hackathon: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30',
  Seminar: 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30',
  Competition: 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/30',
  Career: 'bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/30',
  Event: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30',
};

export const EXAM_TYPE_COLORS: Record<string, string> = {
  Final: 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/30',
  Midterm: 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30',
  Quiz: 'bg-blue-500/15 text-blue-600 dark:text-blue-400 border border-blue-500/30',
};
