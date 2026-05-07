import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Play,
  Eye,
  ThumbsUp,
  Clock,
  Zap,
  ExternalLink,
  SlidersHorizontal,
  Search,
  Loader2,
  Sparkles,
  ChevronDown,
  ChevronRight,
  BookOpen,
  GraduationCap,
  Map,
} from 'lucide-react';
import type { Video } from '../types';
import { useDomains } from '../hooks/useDomains';
import { formatViews, formatDuration } from '../utils/format';
import { getYouTubeEmbedUrl } from '../utils/youtube';
import { fetchVideos, generateRoadmap } from '../services/api';
import type { RoadmapResult, TopicVideo } from '../services/api';
import { LEVELS, SORT_OPTIONS } from '../constants/filters';
import PageHeader from '../components/ui/PageHeader';
import LevelBadge from '../components/ui/LevelBadge';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import DomainFilter from '../components/ui/DomainFilter';
import FilterButton from '../components/ui/FilterButton';

type SortOption = 'ai_score' | 'views' | 'likes' | 'created_at';
type ViewMode = 'playlist' | 'roadmap';

const LEVEL_COLORS: Record<string, string> = {
  Beginner: '#10B981',
  Intermediate: '#F59E0B',
  Advanced: '#EF4444',
};

export default function Playlist() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [videos, setVideos] = useState<Video[]>([]);
  const [currentVideo, setCurrentVideo] = useState<Video | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>('ai_score');
  const { domains } = useDomains();

  // Roadmap state
  const [viewMode, setViewMode] = useState<ViewMode>('playlist');
  const [searchQuery, setSearchQuery] = useState('');
  const [generating, setGenerating] = useState(false);
  const [roadmap, setRoadmap] = useState<RoadmapResult | null>(null);
  const [expandedSkills, setExpandedSkills] = useState<Set<number>>(new Set());
  const [activeTopicVideo, setActiveTopicVideo] = useState<TopicVideo | null>(null);
  const [generateError, setGenerateError] = useState<string | null>(null);

  const selectedDomain = searchParams.get('domain');
  const autoGenerate = searchParams.get('generate');
  const roadmapId = searchParams.get('roadmap');

  // Auto-generate roadmap when navigated from Courses page with ?generate=
  useEffect(() => {
    if (autoGenerate && !generating && !roadmap) {
      setSearchQuery(autoGenerate);
      // Clear the param to avoid re-triggering
      const params = new URLSearchParams(searchParams);
      params.delete('generate');
      setSearchParams(params, { replace: true });
      // Trigger generation
      (async () => {
        setGenerating(true);
        setGenerateError(null);
        setViewMode('roadmap');
        try {
          const result = await generateRoadmap(autoGenerate, selectedDomain);
          setRoadmap(result);
          setExpandedSkills(new Set(result.skills.map((_: any, i: number) => i)));
          for (const skill of result.skills) {
            for (const topic of skill.topics) {
              if (topic.video_url) { setActiveTopicVideo(topic); return; }
            }
          }
        } catch (err: any) {
          setGenerateError(err.message || 'Failed to generate roadmap');
        } finally {
          setGenerating(false);
        }
      })();
    }
  }, [autoGenerate]);

  // Load saved roadmap when navigated with ?roadmap=id
  useEffect(() => {
    if (roadmapId && !roadmap) {
      (async () => {
        setGenerating(true);
        setViewMode('roadmap');
        try {
          const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
          const res = await fetch(`${API_BASE}/roadmap/${roadmapId}`);
          if (!res.ok) throw new Error('Roadmap not found');
          const result = await res.json();
          setRoadmap(result);
          setSearchQuery(result.query);
          setExpandedSkills(new Set(result.skills.map((_: any, i: number) => i)));
          for (const skill of result.skills) {
            for (const topic of skill.topics) {
              if (topic.video_url) { setActiveTopicVideo(topic); return; }
            }
          }
        } catch (err: any) {
          setGenerateError(err.message || 'Failed to load roadmap');
        } finally {
          setGenerating(false);
        }
      })();
    }
  }, [roadmapId]);

  useEffect(() => {
    async function loadVideos() {
      setLoading(true);
      try {
        const fetched = await fetchVideos({ domain: selectedDomain, level: selectedLevel, sortBy });
        setVideos(fetched);
        const vid = searchParams.get('video');
        if (fetched.length > 0) {
          const match = vid ? fetched.find(v => v.id === vid) : null;
          setCurrentVideo(match || fetched[0]);
        } else {
          setCurrentVideo(null);
        }
      } catch (err) {
        console.error('Failed to load videos:', err);
      } finally {
        setLoading(false);
      }
    }
    loadVideos();
  }, [selectedDomain, selectedLevel, sortBy]);

  const handleDomainChange = (domainId: string | null) => {
    const params = new URLSearchParams(searchParams);
    if (domainId) { params.set('domain', domainId); } else { params.delete('domain'); }
    params.delete('video');
    setSearchParams(params);
  };

  const handleVideoSelect = (video: Video) => {
    setCurrentVideo(video);
  };

  const handleGenerateRoadmap = async () => {
    if (!searchQuery.trim()) return;
    setGenerating(true);
    setGenerateError(null);
    setRoadmap(null);
    setViewMode('roadmap');
    try {
      const result = await generateRoadmap(searchQuery.trim(), selectedDomain);
      setRoadmap(result);
      // Expand all skills by default
      setExpandedSkills(new Set(result.skills.map((_, i) => i)));
      // Set the first valid video as active
      for (const skill of result.skills) {
        for (const topic of skill.topics) {
          if (topic.video_url) {
            setActiveTopicVideo(topic);
            return;
          }
        }
      }
    } catch (err: any) {
      setGenerateError(err.message || 'Failed to generate roadmap');
    } finally {
      setGenerating(false);
    }
  };

  const toggleSkill = (index: number) => {
    setExpandedSkills(prev => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index); else next.add(index);
      return next;
    });
  };

  // Count total topic number across all skills
  const getGlobalTopicNumber = (skillIndex: number, topicIndex: number): number => {
    if (!roadmap) return 0;
    let count = 0;
    for (let i = 0; i < skillIndex; i++) {
      count += roadmap.skills[i].topics.length;
    }
    return count + topicIndex + 1;
  };

  if (loading && viewMode === 'playlist') return <LoadingSpinner />;

  return (
    <div className="space-y-4">
      <PageHeader
        title="Video Playlist"
        subtitle="AI-curated learning content ranked by quality"
        icon={<Play className="w-4 h-4 lg:w-5 lg:h-5" />}
      />

      {/* ── Generate Roadmap Section ── */}
      <div className="border border-[rgb(var(--border-primary))] bg-[rgb(var(--bg-elevated))] p-4">
        <div className="flex items-center gap-2 mb-3">
          <Map className="w-4 h-4 text-[rgb(var(--color-accent))]" strokeWidth={2} />
          <h3 className="text-xs font-bold text-[rgb(var(--text-primary))] uppercase tracking-wider">
            Generate Learning Roadmap
          </h3>
          <span className="text-[9px] text-[rgb(var(--text-tertiary))] bg-[rgb(var(--bg-base))] px-2 py-0.5 border border-[rgb(var(--border-primary))] uppercase tracking-wider font-medium">
            AI-Powered
          </span>
        </div>
        <p className="text-xs text-[rgb(var(--text-secondary))] mb-3">
          Enter a domain or skill — AI will create a structured learning path with the single best video for each topic.
        </p>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[rgb(var(--text-tertiary))]" strokeWidth={2} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleGenerateRoadmap()}
              placeholder="e.g., Web Development, Machine Learning, React, Docker..."
              disabled={generating}
              className="w-full pl-10 pr-4 py-2.5 bg-[rgb(var(--bg-base))] border border-[rgb(var(--border-primary))] text-sm text-[rgb(var(--text-primary))] placeholder:text-[rgb(var(--text-tertiary))] focus:outline-none focus:border-[rgb(var(--color-primary))] transition-colors disabled:opacity-50"
            />
          </div>
          <button
            onClick={handleGenerateRoadmap}
            disabled={generating || !searchQuery.trim()}
            className="flex items-center gap-2 px-5 py-2.5 bg-[rgb(var(--color-primary))] text-white text-sm font-bold uppercase tracking-wider hover:brightness-110 transition-all disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
          >
            {generating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" strokeWidth={2} />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" strokeWidth={2} />
                Generate Roadmap
              </>
            )}
          </button>
        </div>
        {generateError && (
          <p className="mt-2 text-xs font-medium text-red-500">{generateError}</p>
        )}
      </div>

      {/* ── View Mode Toggle ── */}
      {roadmap && (
        <div className="flex gap-2">
          <button
            onClick={() => setViewMode('roadmap')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold uppercase tracking-wider border transition-all ${
              viewMode === 'roadmap'
                ? 'border-[rgb(var(--color-primary))] bg-[rgb(var(--color-primary))]/10 text-[rgb(var(--color-primary))]'
                : 'border-[rgb(var(--border-primary))] text-[rgb(var(--text-secondary))] hover:border-[rgb(var(--color-primary))]/50'
            }`}
          >
            <Map className="w-3.5 h-3.5" strokeWidth={2} />
            Roadmap
          </button>
          <button
            onClick={() => setViewMode('playlist')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold uppercase tracking-wider border transition-all ${
              viewMode === 'playlist'
                ? 'border-[rgb(var(--color-primary))] bg-[rgb(var(--color-primary))]/10 text-[rgb(var(--color-primary))]'
                : 'border-[rgb(var(--border-primary))] text-[rgb(var(--text-secondary))] hover:border-[rgb(var(--color-primary))]/50'
            }`}
          >
            <Play className="w-3.5 h-3.5" strokeWidth={2} />
            All Videos
          </button>
        </div>
      )}

      {/* ── Generating Loading ── */}
      {generating && (
        <div className="border border-[rgb(var(--border-primary))] bg-[rgb(var(--bg-elevated))] p-8 text-center">
          <Loader2 className="w-10 h-10 text-[rgb(var(--color-primary))] mx-auto mb-4 animate-spin" strokeWidth={1.5} />
          <h3 className="text-lg font-bold text-[rgb(var(--text-primary))] mb-2">Generating Your Roadmap</h3>
          <p className="text-sm text-[rgb(var(--text-secondary))] max-w-md mx-auto">
            AI is identifying skills, breaking them into topics, searching YouTube, and scoring each video to pick the single best one per topic...
          </p>
          <p className="text-xs text-[rgb(var(--text-tertiary))] mt-3">This may take 1-2 minutes</p>
        </div>
      )}

      {/* ══════════════ ROADMAP VIEW ══════════════ */}
      {viewMode === 'roadmap' && roadmap && !generating && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Video Player */}
          <div className="lg:col-span-2 space-y-3">
            {activeTopicVideo && activeTopicVideo.video_url ? (
              <>
                <div className="border border-[rgb(var(--border-primary))] bg-[rgb(var(--bg-elevated))] overflow-hidden">
                  <div className="relative aspect-video bg-black">
                    <iframe
                      src={getYouTubeEmbedUrl(activeTopicVideo.video_url)}
                      title={activeTopicVideo.video_title}
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                </div>
                <div className="border border-[rgb(var(--border-primary))] bg-[rgb(var(--bg-elevated))] p-4">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div>
                      <p className="text-[10px] font-bold text-[rgb(var(--color-accent))] uppercase tracking-wider mb-1">
                        {activeTopicVideo.topic}
                      </p>
                      <h1 className="text-lg lg:text-xl font-bold text-[rgb(var(--text-primary))] leading-tight">
                        {activeTopicVideo.video_title}
                      </h1>
                    </div>
                    <a
                      href={activeTopicVideo.video_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-shrink-0 p-2 border border-[rgb(var(--border-primary))] hover:border-[rgb(var(--color-primary))] hover:text-[rgb(var(--color-primary))] transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" strokeWidth={2} />
                    </a>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 mb-3">
                    <div className="flex items-center gap-1.5 px-2.5 py-1 bg-[rgb(var(--color-primary))]/10 border border-[rgb(var(--color-primary))]/20">
                      <Zap className="w-3.5 h-3.5 text-[rgb(var(--color-primary))]" strokeWidth={2} />
                      <span className="text-xs font-bold text-[rgb(var(--color-primary))]">
                        AI Score: {activeTopicVideo.ai_score}
                      </span>
                    </div>
                    <LevelBadge level={activeTopicVideo.level} />
                  </div>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-[rgb(var(--text-secondary))]">
                    <div className="flex items-center gap-1.5">
                      <Eye className="w-4 h-4" strokeWidth={2} />
                      <span className="font-medium">{formatViews(activeTopicVideo.views)} views</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <ThumbsUp className="w-4 h-4" strokeWidth={2} />
                      <span className="font-medium">{formatViews(activeTopicVideo.likes)} likes</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-4 h-4" strokeWidth={2} />
                      <span className="font-medium">{formatDuration(activeTopicVideo.duration)}</span>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-[rgb(var(--border-primary))]">
                    <p className="text-xs font-semibold text-[rgb(var(--text-tertiary))] uppercase tracking-wider mb-1">Channel</p>
                    <p className="text-sm font-semibold text-[rgb(var(--text-primary))]">{activeTopicVideo.channel_name}</p>
                  </div>
                </div>
              </>
            ) : (
              <div className="border border-[rgb(var(--border-primary))] bg-[rgb(var(--bg-elevated))] p-8 text-center">
                <GraduationCap className="w-12 h-12 text-[rgb(var(--text-tertiary))] mx-auto mb-3" strokeWidth={1.5} />
                <p className="text-sm text-[rgb(var(--text-secondary))]">Select a topic to start watching</p>
              </div>
            )}
          </div>

          {/* Roadmap Sidebar */}
          <div className="space-y-3">
            {/* Roadmap Header */}
            <div className="border border-[rgb(var(--border-primary))] bg-[rgb(var(--bg-elevated))] p-3">
              <h2 className="text-sm font-bold text-[rgb(var(--text-primary))] uppercase tracking-wide mb-1">
                {roadmap.title}
              </h2>
              <p className="text-[10px] text-[rgb(var(--text-secondary))] mb-2">{roadmap.description}</p>
              <div className="flex items-center gap-3 text-[10px] font-semibold text-[rgb(var(--text-tertiary))] uppercase tracking-wider">
                <span>{roadmap.total_videos} videos</span>
                <span>•</span>
                <span>{roadmap.total_duration}</span>
                <span>•</span>
                <span>{roadmap.skills.length} skills</span>
              </div>
            </div>

            {/* Skills List */}
            <div className="border border-[rgb(var(--border-primary))] bg-[rgb(var(--bg-elevated))] max-h-[calc(100vh-16rem)] overflow-y-auto">
              {roadmap.skills.map((skill, skillIdx) => (
                <div key={skillIdx} className="border-b border-[rgb(var(--border-primary))] last:border-b-0">
                  {/* Skill Header */}
                  <button
                    onClick={() => toggleSkill(skillIdx)}
                    className="w-full flex items-center gap-2 p-3 text-left hover:bg-[rgb(var(--bg-base))]/50 transition-colors"
                  >
                    {expandedSkills.has(skillIdx) ? (
                      <ChevronDown className="w-3.5 h-3.5 text-[rgb(var(--text-tertiary))]" strokeWidth={2} />
                    ) : (
                      <ChevronRight className="w-3.5 h-3.5 text-[rgb(var(--text-tertiary))]" strokeWidth={2} />
                    )}
                    <BookOpen className="w-3.5 h-3.5" style={{ color: LEVEL_COLORS[skill.level] || '#3b82f6' }} strokeWidth={2} />
                    <span className="flex-1 text-xs font-bold text-[rgb(var(--text-primary))] uppercase tracking-wider">
                      {skill.name}
                    </span>
                    <span
                      className="px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-wider border"
                      style={{
                        color: LEVEL_COLORS[skill.level] || '#3b82f6',
                        borderColor: `${LEVEL_COLORS[skill.level] || '#3b82f6'}40`,
                        backgroundColor: `${LEVEL_COLORS[skill.level] || '#3b82f6'}10`,
                      }}
                    >
                      {skill.level}
                    </span>
                  </button>

                  {/* Topics */}
                  {expandedSkills.has(skillIdx) && (
                    <div className="pb-1">
                      {skill.topics.map((topic, topicIdx) => {
                        const globalNum = getGlobalTopicNumber(skillIdx, topicIdx);
                        const isActive = activeTopicVideo?.topic === topic.topic && activeTopicVideo?.video_url === topic.video_url;
                        const hasVideo = !!topic.video_url;

                        return (
                          <button
                            key={topicIdx}
                            onClick={() => hasVideo && setActiveTopicVideo(topic)}
                            disabled={!hasVideo}
                            className={`w-full text-left px-3 py-2 flex gap-2 transition-all ${
                              isActive
                                ? 'bg-[rgb(var(--color-primary))]/8 border-l-2 border-l-[rgb(var(--color-primary))]'
                                : hasVideo
                                ? 'hover:bg-[rgb(var(--bg-base))]/50 border-l-2 border-l-transparent'
                                : 'opacity-40 cursor-not-allowed border-l-2 border-l-transparent'
                            }`}
                          >
                            <span className={`flex-shrink-0 w-5 h-5 flex items-center justify-center text-[9px] font-bold ${
                              isActive
                                ? 'bg-[rgb(var(--color-primary))] text-white'
                                : 'bg-[rgb(var(--bg-base))] text-[rgb(var(--text-tertiary))] border border-[rgb(var(--border-primary))]'
                            }`}>
                              {globalNum}
                            </span>
                            <div className="flex-1 min-w-0">
                              <p className={`text-[11px] font-semibold leading-snug line-clamp-1 ${
                                isActive ? 'text-[rgb(var(--color-primary))]' : 'text-[rgb(var(--text-primary))]'
                              }`}>
                                {topic.topic}
                              </p>
                              {hasVideo && (
                                <div className="flex items-center gap-1.5 mt-0.5">
                                  <p className="text-[9px] text-[rgb(var(--text-tertiary))] truncate flex-1">
                                    {topic.channel_name}
                                  </p>
                                  <div className="flex items-center gap-0.5 text-[9px] text-[rgb(var(--color-accent))] font-bold">
                                    <Zap className="w-2.5 h-2.5" strokeWidth={2} />
                                    {topic.ai_score}
                                  </div>
                                  <span className="text-[9px] text-[rgb(var(--text-tertiary))]">
                                    {topic.duration}
                                  </span>
                                </div>
                              )}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ══════════════ REGULAR PLAYLIST VIEW ══════════════ */}
      {viewMode === 'playlist' && !generating && (
        <>
          <div className="space-y-3">
            <DomainFilter
              domains={domains}
              selected={selectedDomain}
              onSelect={handleDomainChange}
            />
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-3.5 h-3.5 text-[rgb(var(--text-tertiary))]" strokeWidth={2} />
                <span className="text-[10px] sm:text-xs text-[rgb(var(--text-secondary))] uppercase tracking-wider font-semibold">Level:</span>
              </div>
              {LEVELS.map((level) => (
                <FilterButton
                  key={level}
                  active={selectedLevel === level}
                  onClick={() => setSelectedLevel(selectedLevel === level ? null : level)}
                >
                  {level}
                </FilterButton>
              ))}
              <div className="ml-auto flex items-center gap-2">
                <span className="text-[10px] sm:text-xs text-[rgb(var(--text-secondary))] font-medium uppercase tracking-wide hidden sm:inline">Sort:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className="bg-[rgb(var(--bg-elevated))] border border-[rgb(var(--border-primary))] px-2 sm:px-3 py-1.5 text-[10px] sm:text-xs text-[rgb(var(--text-primary))] focus:outline-none focus:border-[rgb(var(--color-primary))] transition-all cursor-pointer uppercase tracking-wider font-semibold"
                >
                  {SORT_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2 space-y-3">
              {currentVideo ? (
                <>
                  <div className="border border-[rgb(var(--border-primary))] bg-[rgb(var(--bg-elevated))] overflow-hidden">
                    <div className="relative aspect-video bg-black">
                      <iframe
                        src={getYouTubeEmbedUrl(currentVideo.video_url)}
                        title={currentVideo.title}
                        className="w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                  </div>
                  <div className="border border-[rgb(var(--border-primary))] bg-[rgb(var(--bg-elevated))] p-4">
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <h1 className="text-lg lg:text-xl font-bold text-[rgb(var(--text-primary))] leading-tight">{currentVideo.title}</h1>
                      <a href={currentVideo.video_url} target="_blank" rel="noopener noreferrer" className="flex-shrink-0 p-2 border border-[rgb(var(--border-primary))] hover:border-[rgb(var(--color-primary))] hover:text-[rgb(var(--color-primary))] transition-colors" title="Open in YouTube">
                        <ExternalLink className="w-4 h-4" strokeWidth={2} />
                      </a>
                    </div>
                    <div className="flex flex-wrap items-center gap-3 mb-3">
                      <div className="flex items-center gap-1.5 px-2.5 py-1 bg-[rgb(var(--color-primary))]/10 border border-[rgb(var(--color-primary))]/20">
                        <Zap className="w-3.5 h-3.5 text-[rgb(var(--color-primary))]" strokeWidth={2} />
                        <span className="text-xs font-bold text-[rgb(var(--color-primary))]">AI Score: {currentVideo.ai_score}</span>
                      </div>
                      <LevelBadge level={currentVideo.level} />
                      {currentVideo.domains && (
                        <span className="px-2.5 py-1 text-xs font-bold border uppercase tracking-wider" style={{ borderColor: `${currentVideo.domains.color}40`, color: currentVideo.domains.color, backgroundColor: `${currentVideo.domains.color}08` }}>
                          {currentVideo.domains.name}
                        </span>
                      )}
                    </div>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-[rgb(var(--text-secondary))]">
                      <div className="flex items-center gap-1.5"><Eye className="w-4 h-4" strokeWidth={2} /><span className="font-medium">{formatViews(currentVideo.views)} views</span></div>
                      <div className="flex items-center gap-1.5"><ThumbsUp className="w-4 h-4" strokeWidth={2} /><span className="font-medium">{formatViews(currentVideo.likes)} likes</span></div>
                      <div className="flex items-center gap-1.5"><Clock className="w-4 h-4" strokeWidth={2} /><span className="font-medium">{formatDuration(currentVideo.duration)}</span></div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-[rgb(var(--border-primary))]">
                      <p className="text-xs font-semibold text-[rgb(var(--text-tertiary))] uppercase tracking-wider mb-1">Channel</p>
                      <p className="text-sm font-semibold text-[rgb(var(--text-primary))]">{currentVideo.channel_name}</p>
                    </div>
                    {currentVideo.description && (
                      <div className="mt-4 pt-4 border-t border-[rgb(var(--border-primary))]">
                        <p className="text-xs font-semibold text-[rgb(var(--text-tertiary))] uppercase tracking-wider mb-2">Description</p>
                        <p className="text-sm text-[rgb(var(--text-secondary))] leading-relaxed whitespace-pre-wrap">{currentVideo.description}</p>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="border border-[rgb(var(--border-primary))] bg-[rgb(var(--bg-elevated))] p-8 text-center">
                  <Play className="w-12 h-12 text-[rgb(var(--text-tertiary))] mx-auto mb-3" strokeWidth={1.5} />
                  <p className="text-sm text-[rgb(var(--text-secondary))]">No videos available</p>
                </div>
              )}
            </div>

            <div className="space-y-3">
              <div className="border border-[rgb(var(--border-primary))] bg-[rgb(var(--bg-elevated))] p-3">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-sm font-bold text-[rgb(var(--text-primary))] uppercase tracking-wide">Playlist</h2>
                  <span className="text-xs font-semibold text-[rgb(var(--text-tertiary))]">{videos.length} videos</span>
                </div>
                <div className="space-y-2 max-h-[calc(100vh-16rem)] overflow-y-auto pr-1">
                  {videos.map((video, index) => (
                    <button
                      key={video.id}
                      onClick={() => handleVideoSelect(video)}
                      className={`w-full text-left group border transition-all duration-200 ${
                        currentVideo?.id === video.id
                          ? 'border-[rgb(var(--color-primary))] bg-[rgb(var(--color-primary))]/5'
                          : 'border-[rgb(var(--border-primary))] bg-[rgb(var(--bg-base))] hover:border-[rgb(var(--color-primary))]/50'
                      }`}
                    >
                      <div className="flex gap-2 p-2">
                        <div className="relative flex-shrink-0 w-24 aspect-video overflow-hidden bg-[rgb(var(--bg-overlay))]">
                          <img src={video.thumbnail_url} alt={video.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                          <div className="absolute bottom-1 right-1"><span className="px-1 py-0.5 bg-black/80 text-[9px] text-white font-medium">{formatDuration(video.duration)}</span></div>
                          {currentVideo?.id === video.id && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black/40"><Play className="w-5 h-5 text-white" fill="white" strokeWidth={2} /></div>
                          )}
                          <div className="absolute top-1 left-1"><span className="px-1 py-0.5 bg-[rgb(var(--text-primary))]/80 text-[9px] font-bold text-[rgb(var(--bg-base))]">{index + 1}</span></div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className={`text-[11px] font-semibold leading-snug line-clamp-2 mb-1 ${currentVideo?.id === video.id ? 'text-[rgb(var(--color-primary))]' : 'text-[rgb(var(--text-primary))] group-hover:text-[rgb(var(--color-primary))]'}`}>{video.title}</h3>
                          <p className="text-[9px] text-[rgb(var(--text-tertiary))] font-medium uppercase tracking-wide truncate mb-1">{video.channel_name}</p>
                          <div className="flex items-center gap-1.5">
                            <div className="flex items-center gap-0.5 text-[9px] text-[rgb(var(--text-secondary))]"><Eye className="w-2.5 h-2.5" strokeWidth={2} />{formatViews(video.views)}</div>
                            <div className="px-1 py-0.5 bg-[rgb(var(--color-accent))]/10 border border-[rgb(var(--color-accent))]/20">
                              <span className="text-[9px] font-bold text-[rgb(var(--color-accent))] flex items-center gap-0.5"><Zap className="w-2.5 h-2.5" strokeWidth={2} />{video.ai_score}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
