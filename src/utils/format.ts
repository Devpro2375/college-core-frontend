export function formatViews(views: number): string {
  if (views >= 1_000_000) return `${(views / 1_000_000).toFixed(1)}M`;
  if (views >= 1_000) return `${(views / 1_000).toFixed(1)}K`;
  return views.toString();
}

export function formatDuration(duration: string): string {
  const parts = duration.split(':');
  if (parts.length === 3) {
    const hours = parseInt(parts[0]);
    const mins = parseInt(parts[1]);
    if (hours > 0) return `${hours}h ${mins}m`;
    return `${mins}m`;
  }
  return duration;
}
