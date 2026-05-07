import { type ReactNode } from 'react';

interface PageHeaderProps {
  title: string;
  subtitle: string;
  icon: ReactNode;
}

export default function PageHeader({ title, subtitle, icon }: PageHeaderProps) {
  return (
    <div className="mb-3 lg:mb-4 pb-3 lg:pb-4 border-b border-[rgb(var(--border-secondary))]">
      <div className="flex items-center gap-2 lg:gap-3">
        <div className="w-8 h-8 lg:w-10 lg:h-10 bg-[rgb(var(--color-primary))] flex items-center justify-center text-white flex-shrink-0">
          {icon}
        </div>
        <div className="min-w-0">
          <h1 className="text-base sm:text-lg lg:text-xl font-bold text-[rgb(var(--text-primary))] tracking-tight">{title}</h1>
          <p className="text-[10px] sm:text-xs lg:text-sm text-[rgb(var(--text-secondary))] mt-0.5">{subtitle}</p>
        </div>
      </div>
    </div>
  );
}
