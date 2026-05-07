export default function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center py-20">
      <div className="w-8 h-8 border-2 border-[rgb(var(--border-primary))] border-t-[rgb(var(--color-primary))] animate-spin" />
    </div>
  );
}
