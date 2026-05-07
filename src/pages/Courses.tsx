import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BookOpen,
  Star,
  Clock,
  PlayCircle,
  User,
  Map,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import type { Course } from '../types';
import { useDomains } from '../hooks/useDomains';
import { fetchCourses } from '../services/api';
import type { RoadmapResult } from '../services/api';
import { LEVELS } from '../constants/filters';
import DomainFilter from '../components/ui/DomainFilter';
import LevelBadge from '../components/ui/LevelBadge';
import PageHeader from '../components/ui/PageHeader';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import FilterButton from '../components/ui/FilterButton';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function Courses() {
  const navigate = useNavigate();
  const [courses, setCourses] = useState<Course[]>([]);
  const [roadmaps, setRoadmaps] = useState<RoadmapResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDomain, setSelectedDomain] = useState<string | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null);
  const { domains } = useDomains();

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const [courseData, roadmapData] = await Promise.all([
        fetchCourses({ domain: selectedDomain, level: selectedLevel }),
        fetch(`${API_BASE}/roadmap`)
          .then(r => r.ok ? r.json() : [])
          .catch(() => []),
      ]);
      setCourses(courseData);
      setRoadmaps(roadmapData);
      setLoading(false);
    }
    loadData();
  }, [selectedDomain, selectedLevel]);

  const handleCourseClick = (course: Course) => {
    navigate(`/playlist?domain=${course.domain_id}`);
  };

  const handleDomainClick = (domainName: string) => {
    // Navigate to playlist page with pre-filled search query
    navigate(`/playlist?generate=${encodeURIComponent(domainName)}`);
  };

  const handleRoadmapClick = (roadmapId: string) => {
    navigate(`/playlist?roadmap=${roadmapId}`);
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <PageHeader
        title="Courses"
        subtitle="Structured learning pathways curated by AI"
        icon={<BookOpen className="w-5 h-5" />}
      />

      <DomainFilter domains={domains} selected={selectedDomain} onSelect={setSelectedDomain} />

      <div className="flex flex-wrap gap-2">
        {LEVELS.map((level) => (
          <FilterButton
            key={level}
            active={selectedLevel === level}
            onClick={() => setSelectedLevel(selectedLevel === level ? null : level)}
          >
            {level}
          </FilterButton>
        ))}
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="space-y-6">

          {/* ── Domain-based Roadmap Cards ── */}
          {!selectedDomain && domains.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Map className="w-4 h-4 text-[rgb(var(--color-accent))]" strokeWidth={2} />
                <h2 className="text-xs font-bold text-[rgb(var(--text-primary))] uppercase tracking-wider">
                  Generate AI Roadmap by Domain
                </h2>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                {domains.map((domain) => (
                  <button
                    key={domain.id}
                    onClick={() => handleDomainClick(domain.name)}
                    className="group border border-[rgb(var(--border-primary))] bg-[rgb(var(--bg-elevated))] p-4 text-left hover:border-[rgb(var(--color-primary))] transition-all duration-200"
                  >
                    <div
                      className="w-10 h-10 flex items-center justify-center text-xl mb-3 border"
                      style={{
                        borderColor: `${domain.color}40`,
                        backgroundColor: `${domain.color}10`,
                      }}
                    >
                      {domain.icon}
                    </div>
                    <h3 className="text-xs sm:text-sm font-bold text-[rgb(var(--text-primary))] group-hover:text-[rgb(var(--color-primary))] transition-colors mb-1">
                      {domain.name}
                    </h3>
                    <div className="flex items-center gap-1 text-[10px] text-[rgb(var(--color-accent))] font-semibold uppercase tracking-wider">
                      <Sparkles className="w-3 h-3" strokeWidth={2} />
                      Generate Roadmap
                      <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" strokeWidth={2} />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ── Previously Generated Roadmaps ── */}
          {roadmaps.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-4 h-4 text-[rgb(var(--color-primary))]" strokeWidth={2} />
                <h2 className="text-xs font-bold text-[rgb(var(--text-primary))] uppercase tracking-wider">
                  AI-Generated Roadmaps
                </h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                {roadmaps.map((rm) => (
                  <button
                    key={rm.id}
                    onClick={() => handleRoadmapClick(rm.id)}
                    className="group border border-[rgb(var(--border-primary))] bg-[rgb(var(--bg-elevated))] text-left hover:border-[rgb(var(--color-primary))] transition-all duration-200 flex flex-col"
                  >
                    <div className="p-4 flex-1 space-y-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-[rgb(var(--color-primary))]/10 border border-[rgb(var(--color-primary))]/20 flex items-center justify-center">
                          <Map className="w-4 h-4 text-[rgb(var(--color-primary))]" strokeWidth={2} />
                        </div>
                        <h3 className="text-xs sm:text-sm font-bold text-[rgb(var(--text-primary))] group-hover:text-[rgb(var(--color-primary))] transition-colors line-clamp-1 flex-1">
                          {rm.title}
                        </h3>
                      </div>
                      <p className="text-[10px] sm:text-xs text-[rgb(var(--text-secondary))] line-clamp-2 leading-relaxed">
                        {rm.description}
                      </p>
                      <div className="flex items-center gap-3 text-[10px] text-[rgb(var(--text-tertiary))] font-semibold">
                        <span className="flex items-center gap-1">
                          <PlayCircle className="w-3 h-3" strokeWidth={2} />
                          {rm.total_videos} videos
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" strokeWidth={2} />
                          {rm.total_duration}
                        </span>
                      </div>
                    </div>
                    <div className="w-full py-2 bg-[rgb(var(--color-primary))] text-white text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-center group-hover:bg-[rgb(var(--color-primary-hover))] transition-all duration-200">
                      View Roadmap
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ── Traditional Courses ── */}
          {courses.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <BookOpen className="w-4 h-4 text-[rgb(var(--text-secondary))]" strokeWidth={2} />
                <h2 className="text-xs font-bold text-[rgb(var(--text-primary))] uppercase tracking-wider">
                  Courses
                </h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                {courses.map((course) => (
                  <div
                    key={course.id}
                    onClick={() => handleCourseClick(course)}
                    className="group border border-[rgb(var(--border-primary))] bg-[rgb(var(--bg-elevated))] overflow-hidden hover:border-[rgb(var(--color-primary))] transition-all duration-200 flex flex-col cursor-pointer"
                  >
                    <div className="relative aspect-video overflow-hidden bg-[rgb(var(--bg-overlay))]">
                      <img
                        src={course.thumbnail_url}
                        alt={course.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[rgb(var(--color-primary))] flex items-center justify-center shadow-lg">
                          <PlayCircle className="w-5 h-5 sm:w-6 sm:h-6 text-white" strokeWidth={2} />
                        </div>
                      </div>
                      <div className="absolute bottom-2 left-2">
                        <LevelBadge level={course.level} />
                      </div>
                    </div>
                    <div className="p-3 space-y-2 flex flex-col flex-1">
                      <h3 className="text-xs sm:text-sm font-semibold text-[rgb(var(--text-primary))] line-clamp-2 group-hover:text-[rgb(var(--color-primary))] transition-colors leading-relaxed min-h-[2.5rem]">
                        {course.title}
                      </h3>
                      <p className="text-[10px] sm:text-xs text-[rgb(var(--text-secondary))] line-clamp-2 leading-relaxed">{course.description}</p>

                      <div className="flex items-center gap-1.5">
                        <User className="w-3 h-3 text-[rgb(var(--text-tertiary))]" strokeWidth={2} />
                        <span className="text-[10px] sm:text-xs text-[rgb(var(--text-secondary))] font-medium uppercase tracking-wide truncate">{course.instructor}</span>
                      </div>

                      <div className="flex items-center gap-3 text-[10px] sm:text-xs text-[rgb(var(--text-secondary))]">
                        <span className="flex items-center gap-1">
                          <PlayCircle className="w-3 h-3" strokeWidth={2} />
                          {course.video_count}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" strokeWidth={2} />
                          {course.duration_hours}h
                        </span>
                        <span className="flex items-center gap-1">
                          <Star className="w-3 h-3 text-amber-500" fill="currentColor" strokeWidth={2} />
                          <span className="text-amber-600 dark:text-amber-400 font-semibold">{course.rating}</span>
                        </span>
                      </div>

                      {course.domains && (
                        <span
                          className="inline-block px-2 py-0.5 text-[10px] sm:text-xs font-semibold uppercase tracking-wider self-start"
                          style={{
                            backgroundColor: `${course.domains.color}15`,
                            color: course.domains.color,
                            border: `1px solid ${course.domains.color}40`,
                          }}
                        >
                          {course.domains.name}
                        </span>
                      )}

                      <div className="w-full mt-auto py-2 bg-[rgb(var(--color-primary))] border border-[rgb(var(--color-primary))] text-white text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-center group-hover:bg-[rgb(var(--color-primary-hover))] transition-all duration-200">
                        Watch Playlist
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {courses.length === 0 && roadmaps.length === 0 && selectedDomain && (
            <div className="text-center py-20 text-[rgb(var(--text-tertiary))]">No courses found for this domain.</div>
          )}
        </div>
      )}
    </div>
  );
}
