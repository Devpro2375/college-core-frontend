import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  LayoutDashboard,
  Play,
  BookOpen,
  FileText,
  ClipboardList,
  TrendingUp,
  Zap,
  ArrowRight,
  Eye,
  ThumbsUp,
  Clock,
  Calendar,
  Sparkles,
} from 'lucide-react';
import type { Video, CampusEvent } from '../types';
import { useDomains } from '../hooks/useDomains';
import { formatViews, formatDuration } from '../utils/format';
import { fetchDashboardStats, fetchTopVideos, fetchFeaturedEvents, type DashboardStats } from '../services/api';
import PageHeader from '../components/ui/PageHeader';
import LevelBadge from '../components/ui/LevelBadge';
import LoadingSpinner from '../components/ui/LoadingSpinner';

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats>({ videos: 0, courses: 0, notes: 0, pyqs: 0 });
  const [topVideos, setTopVideos] = useState<Video[]>([]);
  const [events, setEvents] = useState<CampusEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const { domains } = useDomains();

  useEffect(() => {
    async function fetchData() {
      try {
        const [statsData, videosData, eventsData] = await Promise.all([
          fetchDashboardStats().catch(() => ({ videos: 0, courses: 0, notes: 0, pyqs: 0 })),
          fetchTopVideos().catch(() => []),
          fetchFeaturedEvents().catch(() => []),
        ]);

        setStats(statsData);
        setTopVideos(videosData);
        setEvents(eventsData);
      } catch (err) {
        console.error('Dashboard fetch error:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) return <LoadingSpinner />;

  const statCards = [
    { label: 'Videos', value: stats.videos, icon: Play, color: '#10B981', link: '/playlist' },
    { label: 'Courses', value: stats.courses, icon: BookOpen, color: '#14B8A6', link: '/courses' },
    { label: 'Notes', value: stats.notes, icon: FileText, color: '#F59E0B', link: '/notes' },
    { label: 'PYQs', value: stats.pyqs, icon: ClipboardList, color: '#8B5CF6', link: '/pyqs' },
  ];

  return (
    <div className="space-y-4 lg:space-y-5">
      <PageHeader
        title="Dashboard"
        subtitle="Your AI-powered learning hub"
        icon={<LayoutDashboard className="w-4 h-4 lg:w-5 lg:h-5" />}
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 lg:gap-3">
        {statCards.map((card) => (
          <Link
            key={card.label}
            to={card.link}
            className="group border border-[rgb(var(--border-primary))] bg-[rgb(var(--bg-elevated))] p-3 hover:border-[rgb(var(--color-primary))] transition-all duration-200"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0 flex-1">
                <p className="text-[10px] sm:text-[11px] text-[rgb(var(--text-secondary))] font-semibold uppercase tracking-wider truncate">{card.label}</p>
                <p className="text-lg sm:text-xl lg:text-2xl font-bold text-[rgb(var(--text-primary))] mt-0.5">{card.value}</p>
              </div>
              <div
                className="w-7 h-7 lg:w-8 lg:h-8 flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: `${card.color}15` }}
              >
                <card.icon className="w-3.5 h-3.5 lg:w-4 lg:h-4" style={{ color: card.color }} strokeWidth={2} />
              </div>
            </div>
            <div className="mt-2 flex items-center gap-1 text-[9px] sm:text-[10px] text-[rgb(var(--text-tertiary))] group-hover:text-[rgb(var(--text-secondary))] transition-colors">
              <TrendingUp className="w-2.5 h-2.5 sm:w-3 sm:h-3" strokeWidth={2} />
              <span className="uppercase tracking-wide font-semibold">AI Curated</span>
            </div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-5">
        <div className="lg:col-span-2 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap className="w-3.5 h-3.5 lg:w-4 lg:h-4 text-[rgb(var(--color-primary))]" strokeWidth={2} />
              <h2 className="text-sm lg:text-base font-bold text-[rgb(var(--text-primary))] tracking-tight">Top AI-Ranked Videos</h2>
            </div>
            <Link
              to="/playlist"
              className="flex items-center gap-1 text-[10px] lg:text-xs text-[rgb(var(--color-primary))] hover:text-[rgb(var(--color-primary-hover))] font-semibold transition-colors uppercase tracking-wider"
            >
              <span className="hidden sm:inline">View All</span>
              <ArrowRight className="w-3 h-3 lg:w-3.5 lg:h-3.5" strokeWidth={2} />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {topVideos.map((video) => (
              <a
                key={video.id}
                href={video.video_url}
                target="_blank"
                rel="noopener noreferrer"
                className="group border border-[rgb(var(--border-primary))] bg-[rgb(var(--bg-elevated))] overflow-hidden hover:border-[rgb(var(--color-primary))] transition-all duration-200"
              >
                <div className="relative aspect-video overflow-hidden bg-[rgb(var(--bg-overlay))]">
                  <img
                    src={video.thumbnail_url}
                    alt={video.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="w-10 h-10 bg-[rgb(var(--color-primary))] flex items-center justify-center shadow-lg">
                      <Play className="w-4 h-4 text-white ml-0.5" fill="white" strokeWidth={2} />
                    </div>
                  </div>
                  <div className="absolute bottom-1.5 left-1.5">
                    <span className="px-1.5 py-0.5 bg-black/80 text-[10px] text-white flex items-center gap-1 backdrop-blur-sm">
                      <Clock className="w-2.5 h-2.5" strokeWidth={2} />
                      {formatDuration(video.duration)}
                    </span>
                  </div>
                  <div className="absolute top-1.5 right-1.5">
                    <div className="px-1.5 py-0.5 bg-[rgb(var(--color-accent))] text-[10px] font-bold text-white flex items-center gap-0.5 shadow-md">
                      <Zap className="w-2.5 h-2.5" strokeWidth={2} />
                      {video.ai_score}
                    </div>
                  </div>
                </div>
                <div className="p-2.5">
                  <h3 className="text-xs font-semibold text-[rgb(var(--text-primary))] line-clamp-2 group-hover:text-[rgb(var(--color-primary))] transition-colors leading-relaxed">
                    {video.title}
                  </h3>
                  <p className="text-[10px] text-[rgb(var(--text-tertiary))] mt-1 font-medium uppercase tracking-wide truncate">{video.channel_name}</p>
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className="text-[10px] text-[rgb(var(--text-secondary))] flex items-center gap-0.5">
                      <Eye className="w-2.5 h-2.5" strokeWidth={2} />
                      {formatViews(video.views)}
                    </span>
                    <span className="text-[10px] text-[rgb(var(--text-secondary))] flex items-center gap-0.5">
                      <ThumbsUp className="w-2.5 h-2.5" strokeWidth={2} />
                      {formatViews(video.likes)}
                    </span>
                    <LevelBadge level={video.level} />
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Calendar className="w-3.5 h-3.5 lg:w-4 lg:h-4 text-[rgb(var(--color-primary))]" strokeWidth={2} />
            <h2 className="text-sm lg:text-base font-bold text-[rgb(var(--text-primary))] tracking-tight">Upcoming Events</h2>
          </div>
          <div className="space-y-2.5">
            {events.map((event) => (
              <div
                key={event.id}
                className="border border-[rgb(var(--border-primary))] bg-[rgb(var(--bg-elevated))] overflow-hidden hover:border-[rgb(var(--color-primary))] transition-all duration-200"
              >
                <div className="relative h-20 lg:h-24 overflow-hidden bg-[rgb(var(--bg-overlay))]">
                  <img
                    src={event.image_url}
                    alt={event.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                  <div className="absolute bottom-1.5 left-1.5">
                    <span className="px-1.5 py-0.5 bg-[rgb(var(--color-primary))]/20 border border-[rgb(var(--color-primary))]/40 text-[rgb(var(--color-primary))] text-[9px] lg:text-[10px] font-bold uppercase tracking-wider backdrop-blur-sm">
                      {event.event_type}
                    </span>
                  </div>
                </div>
                <div className="p-2.5">
                  <h3 className="text-xs font-semibold text-[rgb(var(--text-primary))] line-clamp-1">{event.title}</h3>
                  <p className="text-[10px] text-[rgb(var(--text-secondary))] mt-1 line-clamp-2 leading-relaxed">{event.description}</p>
                  <div className="flex items-center gap-1.5 mt-1.5 text-[9px] lg:text-[10px] text-[rgb(var(--text-tertiary))] uppercase tracking-wide">
                    <span className="truncate">{new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                    <span className="w-0.5 h-0.5 bg-[rgb(var(--border-primary))] flex-shrink-0" />
                    <span className="truncate">{event.time}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="border border-[rgb(var(--border-primary))] bg-[rgb(var(--bg-elevated))] p-3">
            <div className="flex items-center gap-2 mb-2.5">
              <Sparkles className="w-3.5 h-3.5 text-[rgb(var(--color-primary))]" strokeWidth={2} />
              <h3 className="text-xs font-bold text-[rgb(var(--text-primary))] tracking-tight">Learning Domains</h3>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {domains.map((domain) => (
                <Link
                  key={domain.id}
                  to={`/playlist?domain=${domain.id}`}
                  className="px-2 py-0.5 text-[10px] font-bold border transition-all duration-200 uppercase tracking-wider hover:translate-y-[-1px]"
                  style={{
                    borderColor: `${domain.color}40`,
                    color: domain.color,
                    backgroundColor: `${domain.color}08`
                  }}
                >
                  {domain.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
