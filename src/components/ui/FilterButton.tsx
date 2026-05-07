import type { ReactNode } from 'react';

interface FilterButtonProps {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
  className?: string;
}

export default function FilterButton({ active, onClick, children, className = '' }: FilterButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 text-[10px] sm:text-xs font-semibold uppercase tracking-wider transition-all duration-200 ${
        active
          ? 'bg-[rgb(var(--color-primary))] text-white border border-[rgb(var(--color-primary))]'
          : 'bg-[rgb(var(--bg-elevated))] text-[rgb(var(--text-secondary))] border border-[rgb(var(--border-primary))] hover:border-[rgb(var(--color-primary))] hover:text-[rgb(var(--text-primary))]'
      } ${className}`}
    >
      {children}
    </button>
  );
}
