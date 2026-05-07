import { Domain } from '../../types';

interface DomainFilterProps {
  domains: Domain[];
  selected: string | null;
  onSelect: (id: string | null) => void;
}

export default function DomainFilter({ domains, selected, onSelect }: DomainFilterProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => onSelect(null)}
        className={`px-3 py-1.5 text-[10px] sm:text-xs font-semibold uppercase tracking-wider transition-all ${
          selected === null
            ? 'bg-[rgb(var(--color-primary))] text-white border border-[rgb(var(--color-primary))]'
            : 'bg-[rgb(var(--bg-elevated))] text-[rgb(var(--text-secondary))] border border-[rgb(var(--border-primary))] hover:border-[rgb(var(--color-primary))] hover:text-[rgb(var(--text-primary))]'
        }`}
      >
        All
      </button>
      {domains.map((domain) => (
        <button
          key={domain.id}
          onClick={() => onSelect(domain.id)}
          className={`px-3 py-1.5 text-[10px] sm:text-xs font-semibold uppercase tracking-wider transition-all ${
            selected === domain.id
              ? ''
              : 'bg-[rgb(var(--bg-elevated))] text-[rgb(var(--text-secondary))] border border-[rgb(var(--border-primary))] hover:border-[rgb(var(--color-primary))] hover:text-[rgb(var(--text-primary))]'
          }`}
          style={
            selected === domain.id
              ? {
                  backgroundColor: `${domain.color}15`,
                  borderWidth: '1px',
                  borderColor: `${domain.color}50`,
                  color: domain.color,
                }
              : undefined
          }
        >
          {domain.name}
        </button>
      ))}
    </div>
  );
}
