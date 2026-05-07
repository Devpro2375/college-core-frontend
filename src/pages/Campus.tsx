import { useEffect, useState } from 'react';
import {
  Building2,
  MapPin,
  Clock,
  Calendar,
  Users,
  ExternalLink,
  Sparkles,
} from 'lucide-react';
import type { CampusEvent } from '../types';
import { fetchCampusEvents } from '../services/api';
import { EVENT_TYPES, EVENT_TYPE_COLORS } from '../constants/filters';
import PageHeader from '../components/ui/PageHeader';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import FilterButton from '../components/ui/FilterButton';

export default function Campus() {
  const [events, setEvents] = useState<CampusEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState<string | null>(null);

  useEffect(() => {
    async function loadEvents() {
      setLoading(true);
      const data = await fetchCampusEvents(selectedType);
      setEvents(data);
      setLoading(false);
    }
    loadEvents();
  }, [selectedType]);

  return (
    <div className="space-y-4 sm:space-y-6">
      <PageHeader
        title="Campus"
        subtitle="Events, workshops, hackathons, and campus activities"
        icon={<Building2 className="w-5 h-5" />}
      />

      <div className="flex flex-wrap gap-2">
        <FilterButton
          active={selectedType === null}
          onClick={() => setSelectedType(null)}
        >
          All Events
        </FilterButton>
        {EVENT_TYPES.map((type) => (
          <FilterButton
            key={type}
            active={selectedType === type}
            onClick={() => setSelectedType(selectedType === type ? null : type)}
          >
            {type}
          </FilterButton>
        ))}
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : events.length === 0 ? (
        <div className="text-center py-20 text-[rgb(var(--text-tertiary))]">No events found.</div>
      ) : (
        <div className="space-y-6">
          {events.filter((e) => e.is_featured).length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-4 h-4 text-[rgb(var(--color-primary))]" strokeWidth={2} />
                <h2 className="text-base sm:text-lg font-semibold text-[rgb(var(--text-primary))] tracking-tight">Featured Events</h2>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                {events
                  .filter((e) => e.is_featured)
                  .map((event) => (
                    <div
                      key={event.id}
                      className="group border border-[rgb(var(--border-primary))] bg-[rgb(var(--bg-elevated))] overflow-hidden hover:border-[rgb(var(--color-primary))] transition-all duration-200"
                    >
                      <div className="relative h-36 sm:h-40 overflow-hidden bg-[rgb(var(--bg-overlay))]">
                        <img
                          src={event.image_url}
                          alt={event.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                        <div className="absolute bottom-3 left-3 right-3">
                          <span
                            className={`inline-block px-2 py-0.5 text-[10px] sm:text-xs font-semibold uppercase tracking-wider border ${
                              EVENT_TYPE_COLORS[event.event_type] || EVENT_TYPE_COLORS.Event
                            }`}
                          >
                            {event.event_type}
                          </span>
                          <h3 className="text-sm sm:text-base font-bold text-white mt-1.5 leading-snug line-clamp-2">{event.title}</h3>
                        </div>
                      </div>
                      <div className="p-3 sm:p-4 space-y-3">
                        <p className="text-xs sm:text-sm text-[rgb(var(--text-secondary))] line-clamp-2 leading-relaxed">{event.description}</p>
                        <div className="grid grid-cols-2 gap-2 text-[10px] sm:text-xs text-[rgb(var(--text-secondary))]">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3 text-[rgb(var(--text-tertiary))]" strokeWidth={2} />
                            <span className="truncate">
                              {new Date(event.date).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                              })}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3 text-[rgb(var(--text-tertiary))]" strokeWidth={2} />
                            <span className="truncate">{event.time}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-[rgb(var(--text-tertiary))]" strokeWidth={2} />
                            <span className="uppercase tracking-wide truncate">{event.location}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="w-3 h-3 text-[rgb(var(--text-tertiary))]" strokeWidth={2} />
                            <span className="uppercase tracking-wide truncate">{event.organizer}</span>
                          </div>
                        </div>
                        <button className="w-full py-2 bg-[rgb(var(--color-primary))] border border-[rgb(var(--color-primary))] text-white text-[10px] sm:text-xs font-semibold uppercase tracking-wider hover:bg-[rgb(var(--color-primary-hover))] transition-all duration-200 flex items-center justify-center gap-1.5">
                          <ExternalLink className="w-3 h-3 sm:w-3.5 sm:h-3.5" strokeWidth={2} />
                          Register Now
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          <div>
            <h2 className="text-base sm:text-lg font-semibold text-[rgb(var(--text-primary))] mb-4 tracking-tight">All Events</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
              {events.map((event) => (
                <div
                  key={event.id}
                  className="group border border-[rgb(var(--border-primary))] bg-[rgb(var(--bg-elevated))] overflow-hidden hover:border-[rgb(var(--color-primary))] transition-all duration-200"
                >
                  <div className="relative h-28 sm:h-32 overflow-hidden bg-[rgb(var(--bg-overlay))]">
                    <img
                      src={event.image_url}
                      alt={event.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                    <div className="absolute top-2 right-2">
                      <span
                        className={`px-2 py-0.5 text-[10px] sm:text-xs font-semibold uppercase tracking-wider border ${
                          EVENT_TYPE_COLORS[event.event_type] || EVENT_TYPE_COLORS.Event
                        }`}
                      >
                        {event.event_type}
                      </span>
                    </div>
                  </div>
                  <div className="p-3 space-y-2">
                    <h3 className="text-xs sm:text-sm font-semibold text-[rgb(var(--text-primary))] group-hover:text-[rgb(var(--color-primary))] transition-colors line-clamp-2">
                      {event.title}
                    </h3>
                    <p className="text-[10px] sm:text-xs text-[rgb(var(--text-secondary))] line-clamp-2 leading-relaxed">{event.description}</p>
                    <div className="flex items-center gap-2 text-[10px] sm:text-xs text-[rgb(var(--text-tertiary))] pt-1 uppercase tracking-wide">
                      <span className="flex items-center gap-1 truncate">
                        <Calendar className="w-2.5 h-2.5 sm:w-3 sm:h-3" strokeWidth={2} />
                        {new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </span>
                      <span className="w-1 h-1 bg-[rgb(var(--border-primary))] flex-shrink-0" />
                      <span className="flex items-center gap-1 truncate">
                        <MapPin className="w-2.5 h-2.5 sm:w-3 sm:h-3" strokeWidth={2} />
                        {event.location}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
