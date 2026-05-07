import { useEffect, useState } from 'react';
import {
  ClipboardList,
  Download,
  CheckCircle2,
  XCircle,
  Calendar,
  GraduationCap,
  Hash,
  FileCheck,
} from 'lucide-react';
import type { PYQ } from '../types';
import { useDomains } from '../hooks/useDomains';
import { formatViews } from '../utils/format';
import { fetchPyqs } from '../services/api';
import { YEARS, EXAM_TYPES, EXAM_TYPE_COLORS } from '../constants/filters';
import DomainFilter from '../components/ui/DomainFilter';
import PageHeader from '../components/ui/PageHeader';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import FilterButton from '../components/ui/FilterButton';

export default function PYQs() {
  const [pyqs, setPyqs] = useState<PYQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDomain, setSelectedDomain] = useState<string | null>(null);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [selectedExamType, setSelectedExamType] = useState<string | null>(null);
  const { domains } = useDomains();

  useEffect(() => {
    async function loadPyqs() {
      setLoading(true);
      const data = await fetchPyqs({ domain: selectedDomain, year: selectedYear, examType: selectedExamType });
      setPyqs(data);
      setLoading(false);
    }
    loadPyqs();
  }, [selectedDomain, selectedYear, selectedExamType]);

  return (
    <div className="space-y-4 sm:space-y-6">
      <PageHeader
        title="Previous Year Questions"
        subtitle="Exam papers with AI-generated solutions"
        icon={<ClipboardList className="w-5 h-5" />}
      />

      <DomainFilter domains={domains} selected={selectedDomain} onSelect={setSelectedDomain} />

      <div className="flex flex-wrap items-center gap-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[10px] sm:text-xs text-[rgb(var(--text-secondary))] uppercase tracking-wider font-semibold mr-1">Year:</span>
          {YEARS.map((year) => (
            <FilterButton
              key={year}
              active={selectedYear === year}
              onClick={() => setSelectedYear(selectedYear === year ? null : year)}
            >
              {year}
            </FilterButton>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[10px] sm:text-xs text-[rgb(var(--text-secondary))] uppercase tracking-wider font-semibold mr-1">Type:</span>
          {EXAM_TYPES.map((type) => (
            <FilterButton
              key={type}
              active={selectedExamType === type}
              onClick={() => setSelectedExamType(selectedExamType === type ? null : type)}
            >
              {type}
            </FilterButton>
          ))}
        </div>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : pyqs.length === 0 ? (
        <div className="text-center py-20 text-[rgb(var(--text-tertiary))]">No question papers found.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {pyqs.map((pyq) => (
            <div
              key={pyq.id}
              className="group border border-[rgb(var(--border-primary))] bg-[rgb(var(--bg-elevated))] p-3 sm:p-4 hover:border-[rgb(var(--color-primary))] transition-all duration-200 flex flex-col"
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[rgb(var(--color-primary))]/10 border border-[rgb(var(--color-primary))]/30 flex items-center justify-center flex-shrink-0">
                  <FileCheck className="w-4 h-4 sm:w-5 sm:h-5 text-[rgb(var(--color-primary))]" strokeWidth={2} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-xs sm:text-sm font-semibold text-[rgb(var(--text-primary))] group-hover:text-[rgb(var(--color-primary))] transition-colors line-clamp-2 leading-relaxed">
                    {pyq.title}
                  </h3>
                  <p className="text-[10px] sm:text-xs text-[rgb(var(--text-tertiary))] mt-1 font-medium uppercase tracking-wide truncate">{pyq.subject}</p>
                </div>
              </div>

              <div className="mt-3 grid grid-cols-2 gap-2 text-[10px] sm:text-xs text-[rgb(var(--text-secondary))]">
                <div className="flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-[rgb(var(--text-tertiary))]" strokeWidth={2} />
                  <span>{pyq.year}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Hash className="w-3 h-3 text-[rgb(var(--text-tertiary))]" strokeWidth={2} />
                  <span>Sem {pyq.semester}</span>
                </div>
                <div className="flex items-center gap-1 col-span-2">
                  <GraduationCap className="w-3 h-3 text-[rgb(var(--text-tertiary))]" strokeWidth={2} />
                  <span className="uppercase tracking-wide truncate">{pyq.university}</span>
                </div>
                <div className="flex items-center gap-1 col-span-2">
                  {pyq.has_solutions ? (
                    <CheckCircle2 className="w-3 h-3 text-emerald-600 dark:text-emerald-400" strokeWidth={2} />
                  ) : (
                    <XCircle className="w-3 h-3 text-[rgb(var(--text-tertiary))]" strokeWidth={2} />
                  )}
                  <span className={pyq.has_solutions ? 'text-emerald-700 dark:text-emerald-400 font-medium' : 'text-[rgb(var(--text-tertiary))]'}>
                    {pyq.has_solutions ? 'Solutions' : 'No Solutions'}
                  </span>
                </div>
              </div>

              <div className="mt-2 flex items-center flex-wrap gap-1.5">
                <span
                  className={`px-2 py-0.5 text-[10px] sm:text-xs font-semibold uppercase tracking-wider ${
                    EXAM_TYPE_COLORS[pyq.exam_type] || EXAM_TYPE_COLORS.Quiz
                  }`}
                >
                  {pyq.exam_type}
                </span>
                {pyq.domains && (
                  <span
                    className="px-2 py-0.5 text-[10px] sm:text-xs font-semibold uppercase tracking-wider"
                    style={{
                      backgroundColor: `${pyq.domains.color}15`,
                      color: pyq.domains.color,
                      border: `1px solid ${pyq.domains.color}40`,
                    }}
                  >
                    {pyq.domains.name}
                  </span>
                )}
              </div>

              <div className="mt-auto pt-3 flex items-center justify-between">
                <span className="text-[10px] sm:text-xs text-[rgb(var(--text-tertiary))] flex items-center gap-1 uppercase tracking-wide">
                  <Download className="w-3 h-3" strokeWidth={2} />
                  {formatViews(pyq.downloads)}
                </span>
                <button className="px-3 py-1.5 bg-[rgb(var(--color-primary))] border border-[rgb(var(--color-primary))] text-white text-[10px] sm:text-xs font-semibold hover:bg-[rgb(var(--color-primary-hover))] transition-all duration-200 flex items-center gap-1 uppercase tracking-wider">
                  <Download className="w-3 h-3" strokeWidth={2} />
                  Download
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
