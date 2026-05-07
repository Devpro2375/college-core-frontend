import { useEffect, useState } from 'react';
import { FileText, Download, File, BookOpen, User, Hash } from 'lucide-react';
import type { Note } from '../types';
import { useDomains } from '../hooks/useDomains';
import { formatViews } from '../utils/format';
import { fetchNotes } from '../services/api';
import { SEMESTERS } from '../constants/filters';
import DomainFilter from '../components/ui/DomainFilter';
import PageHeader from '../components/ui/PageHeader';
import LoadingSpinner from '../components/ui/LoadingSpinner';

export default function Notes() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDomain, setSelectedDomain] = useState<string | null>(null);
  const [selectedSemester, setSelectedSemester] = useState<number | null>(null);
  const { domains } = useDomains();

  useEffect(() => {
    async function loadNotes() {
      setLoading(true);
      const data = await fetchNotes({ domain: selectedDomain, semester: selectedSemester });
      setNotes(data);
      setLoading(false);
    }
    loadNotes();
  }, [selectedDomain, selectedSemester]);

  return (
    <div className="space-y-4 sm:space-y-6">
      <PageHeader
        title="Notes"
        subtitle="Academic notes organized by subject and semester"
        icon={<FileText className="w-5 h-5" />}
      />

      <DomainFilter domains={domains} selected={selectedDomain} onSelect={setSelectedDomain} />

      <div className="flex flex-wrap items-center gap-2">
        <span className="text-[10px] sm:text-xs text-[rgb(var(--text-secondary))] uppercase tracking-wider font-semibold mr-1">Semester:</span>
        {SEMESTERS.map((sem) => (
          <button
            key={sem}
            onClick={() => setSelectedSemester(selectedSemester === sem ? null : sem)}
            className={`w-8 h-8 sm:w-9 sm:h-9 text-[10px] sm:text-xs font-semibold transition-all duration-200 flex items-center justify-center ${
              selectedSemester === sem
                ? 'bg-[rgb(var(--color-primary))] text-white border border-[rgb(var(--color-primary))]'
                : 'bg-[rgb(var(--bg-elevated))] text-[rgb(var(--text-secondary))] border border-[rgb(var(--border-primary))] hover:border-[rgb(var(--color-primary))] hover:text-[rgb(var(--text-primary))]'
            }`}
          >
            {sem}
          </button>
        ))}
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : notes.length === 0 ? (
        <div className="text-center py-20 text-[rgb(var(--text-tertiary))]">No notes found.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {notes.map((note) => (
            <div
              key={note.id}
              className="group border border-[rgb(var(--border-primary))] bg-[rgb(var(--bg-elevated))] p-3 sm:p-4 hover:border-[rgb(var(--color-primary))] transition-all duration-200 flex flex-col"
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-amber-500/10 border border-amber-500/30 flex items-center justify-center flex-shrink-0">
                  <File className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600 dark:text-amber-400" strokeWidth={2} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-xs sm:text-sm font-semibold text-[rgb(var(--text-primary))] group-hover:text-[rgb(var(--color-primary))] transition-colors line-clamp-2 leading-relaxed">
                    {note.title}
                  </h3>
                  <p className="text-[10px] sm:text-xs text-[rgb(var(--text-secondary))] mt-1 line-clamp-2 leading-relaxed">{note.description}</p>
                </div>
              </div>

              <div className="mt-3 space-y-2">
                <div className="flex items-center gap-1.5 text-[10px] sm:text-xs text-[rgb(var(--text-secondary))]">
                  <BookOpen className="w-3 h-3 text-[rgb(var(--text-tertiary))]" strokeWidth={2} />
                  <span className="uppercase tracking-wide truncate">{note.subject}</span>
                </div>
                <div className="flex items-center gap-1.5 text-[10px] sm:text-xs text-[rgb(var(--text-secondary))]">
                  <User className="w-3 h-3 text-[rgb(var(--text-tertiary))]" strokeWidth={2} />
                  <span className="uppercase tracking-wide truncate">{note.uploaded_by}</span>
                </div>
                <div className="flex items-center gap-3 text-[10px] sm:text-xs text-[rgb(var(--text-secondary))]">
                  <span className="flex items-center gap-1">
                    <Hash className="w-3 h-3" strokeWidth={2} />
                    Sem {note.semester}
                  </span>
                  <span>{note.page_count} pages</span>
                  <span className="px-1.5 py-0.5 bg-[rgb(var(--bg-overlay))] border border-[rgb(var(--border-secondary))] text-[rgb(var(--text-tertiary))] text-[9px] sm:text-[10px] font-semibold uppercase tracking-wider">
                    {note.file_type}
                  </span>
                </div>
              </div>

              {note.domains && (
                <div className="mt-2">
                  <span
                    className="inline-block px-2 py-0.5 text-[10px] sm:text-xs font-semibold uppercase tracking-wider"
                    style={{
                      backgroundColor: `${note.domains.color}15`,
                      color: note.domains.color,
                      border: `1px solid ${note.domains.color}40`,
                    }}
                  >
                    {note.domains.name}
                  </span>
                </div>
              )}

              <div className="mt-auto pt-3 flex items-center justify-between">
                <span className="text-[10px] sm:text-xs text-[rgb(var(--text-tertiary))] flex items-center gap-1 uppercase tracking-wide">
                  <Download className="w-3 h-3" strokeWidth={2} />
                  {formatViews(note.downloads)}
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
