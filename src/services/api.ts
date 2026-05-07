import type { Video, Course, Note, PYQ, CampusEvent, User } from '../types';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// ─── Auth helpers ───────────────────────────────────────────────

function getToken(): string | null {
  return localStorage.getItem('token');
}

async function authFetch<T>(url: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(url, { ...options, headers });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(err.error || `HTTP ${res.status}`);
  }
  return res.json();
}

export async function loginUser(email: string, password: string): Promise<{ token: string; user: User }> {
  return authFetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

export async function registerUser(data: { name: string; email: string; password: string }): Promise<{ token: string; user: User }> {
  return authFetch(`${API_BASE}/auth/register`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function getProfile(): Promise<{ user: User }> {
  return authFetch(`${API_BASE}/auth/me`);
}

export async function completeOnboardingApi(data: { branch?: string; year?: number; interests?: string[] }): Promise<{ user: User }> {
  return authFetch(`${API_BASE}/auth/onboarding`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

// ─── Public helpers ─────────────────────────────────────────────

async function fetchJSON<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(err.error || `HTTP ${res.status}`);
  }
  return res.json();
}

export interface DashboardStats {
  videos: number;
  courses: number;
  notes: number;
  pyqs: number;
}

export async function fetchDashboardStats(): Promise<DashboardStats> {
  return fetchJSON<DashboardStats>(`${API_BASE}/dashboard/stats`);
}

export async function fetchTopVideos(limit = 6): Promise<Video[]> {
  return fetchJSON<Video[]>(`${API_BASE}/videos?sortBy=ai_score&limit=${limit}`);
}

export async function fetchFeaturedEvents(limit = 3): Promise<CampusEvent[]> {
  return fetchJSON<CampusEvent[]>(`${API_BASE}/events/featured?limit=${limit}`);
}

export async function fetchVideos(options: {
  domain?: string | null;
  level?: string | null;
  sortBy?: string;
}): Promise<Video[]> {
  const params = new URLSearchParams();
  if (options.domain) params.set('domain', options.domain);
  if (options.level) params.set('level', options.level);
  if (options.sortBy) params.set('sortBy', options.sortBy);
  return fetchJSON<Video[]>(`${API_BASE}/videos?${params}`);
}

export async function fetchCourses(options: {
  domain?: string | null;
  level?: string | null;
}): Promise<Course[]> {
  const params = new URLSearchParams();
  if (options.domain) params.set('domain', options.domain);
  if (options.level) params.set('level', options.level);
  return fetchJSON<Course[]>(`${API_BASE}/courses?${params}`);
}

export async function fetchNotes(options: {
  domain?: string | null;
  semester?: number | null;
}): Promise<Note[]> {
  const params = new URLSearchParams();
  if (options.domain) params.set('domain', options.domain);
  if (options.semester) params.set('semester', String(options.semester));
  return fetchJSON<Note[]>(`${API_BASE}/notes?${params}`);
}

export async function fetchPyqs(options: {
  domain?: string | null;
  year?: number | null;
  examType?: string | null;
}): Promise<PYQ[]> {
  const params = new URLSearchParams();
  if (options.domain) params.set('domain', options.domain);
  if (options.year) params.set('year', String(options.year));
  if (options.examType) params.set('examType', options.examType);
  return fetchJSON<PYQ[]>(`${API_BASE}/pyqs?${params}`);
}

export async function fetchCampusEvents(type?: string | null): Promise<CampusEvent[]> {
  const params = new URLSearchParams();
  if (type) params.set('type', type);
  return fetchJSON<CampusEvent[]>(`${API_BASE}/events?${params}`);
}

export interface TopicVideo {
  topic: string;
  video_title: string;
  channel_name: string;
  thumbnail_url: string;
  video_url: string;
  duration: string;
  views: number;
  likes: number;
  ai_score: number;
  level: string;
  description: string;
}

export interface RoadmapSkill {
  name: string;
  level: string;
  order: number;
  topics: TopicVideo[];
}

export interface RoadmapResult {
  id: string;
  query: string;
  title: string;
  description: string;
  skills: RoadmapSkill[];
  total_videos: number;
  total_duration: string;
  status: string;
  created_at: string;
}

export async function generateRoadmap(query: string, domainId?: string | null): Promise<RoadmapResult> {
  const res = await fetch(`${API_BASE}/roadmap/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, domain_id: domainId || undefined }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Roadmap generation failed' }));
    throw new Error(err.error || `HTTP ${res.status}`);
  }
  return res.json();
}


