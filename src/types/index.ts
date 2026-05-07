export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  branch: string;
  year: number;
  interests: string[];
  onboarding_complete: boolean;
  course: string;
  semester: number;
  progress: {
    videos_watched: number;
    courses_completed: number;
    notes_downloaded: number;
    time_spent_minutes: number;
  };
  created_at: string;
}

export interface Domain {
  id: string;
  name: string;
  slug: string;
  icon: string;
  color: string;
  created_at: string;
}

export interface Video {
  id: string;
  domain_id: string;
  title: string;
  channel_name: string;
  thumbnail_url: string;
  video_url: string;
  duration: string;
  views: number;
  likes: number;
  ai_score: number;
  level: string;
  tags: string[];
  description: string;
  created_at: string;
  domains?: Domain;
}

export interface Course {
  id: string;
  domain_id: string;
  title: string;
  description: string;
  thumbnail_url: string;
  level: string;
  video_count: number;
  duration_hours: number;
  instructor: string;
  rating: number;
  created_at: string;
  domains?: Domain;
}

export interface Note {
  id: string;
  domain_id: string;
  title: string;
  subject: string;
  semester: number;
  file_url: string;
  file_type: string;
  page_count: number;
  uploaded_by: string;
  downloads: number;
  description: string;
  created_at: string;
  domains?: Domain;
}

export interface PYQ {
  id: string;
  domain_id: string;
  title: string;
  subject: string;
  year: number;
  semester: number;
  exam_type: string;
  file_url: string;
  has_solutions: boolean;
  university: string;
  downloads: number;
  created_at: string;
  domains?: Domain;
}

export interface CampusEvent {
  id: string;
  title: string;
  description: string;
  event_type: string;
  date: string;
  time: string;
  location: string;
  image_url: string;
  organizer: string;
  registration_url: string;
  is_featured: boolean;
  created_at: string;
}
