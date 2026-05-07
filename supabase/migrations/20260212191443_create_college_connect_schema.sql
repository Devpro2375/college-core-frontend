/*
  # College Connect - Initial Schema

  1. New Tables
    - `domains` - Learning domains/categories (Web Dev, AI, Cloud, etc.)
      - `id` (uuid, primary key)
      - `name` (text) - Domain name
      - `slug` (text) - URL-friendly identifier
      - `icon` (text) - Icon identifier
      - `color` (text) - Theme color for the domain
      - `created_at` (timestamptz)

    - `videos` - YouTube video listings sorted by AI
      - `id` (uuid, primary key)
      - `domain_id` (uuid, FK to domains)
      - `title` (text) - Video title
      - `channel_name` (text) - YouTube channel
      - `thumbnail_url` (text)
      - `video_url` (text) - YouTube link
      - `duration` (text) - Video duration
      - `views` (integer)
      - `likes` (integer)
      - `ai_score` (numeric) - AI quality score (0-100)
      - `level` (text) - Beginner/Intermediate/Advanced
      - `tags` (text array)
      - `description` (text)
      - `created_at` (timestamptz)

    - `courses` - Structured learning pathways
      - `id` (uuid, primary key)
      - `domain_id` (uuid, FK to domains)
      - `title` (text)
      - `description` (text)
      - `thumbnail_url` (text)
      - `level` (text)
      - `video_count` (integer)
      - `duration_hours` (numeric)
      - `instructor` (text)
      - `rating` (numeric)
      - `created_at` (timestamptz)

    - `notes` - Academic notes
      - `id` (uuid, primary key)
      - `domain_id` (uuid, FK to domains)
      - `title` (text)
      - `subject` (text)
      - `semester` (integer)
      - `file_url` (text)
      - `file_type` (text) - PDF, DOC, etc.
      - `page_count` (integer)
      - `uploaded_by` (text)
      - `downloads` (integer) default 0
      - `description` (text)
      - `created_at` (timestamptz)

    - `pyqs` - Previous Year Questions
      - `id` (uuid, primary key)
      - `domain_id` (uuid, FK to domains)
      - `title` (text)
      - `subject` (text)
      - `year` (integer)
      - `semester` (integer)
      - `exam_type` (text) - Midterm, Final, Quiz
      - `file_url` (text)
      - `has_solutions` (boolean) default false
      - `university` (text)
      - `downloads` (integer) default 0
      - `created_at` (timestamptz)

    - `campus_events` - Campus activities
      - `id` (uuid, primary key)
      - `title` (text)
      - `description` (text)
      - `event_type` (text) - Workshop, Hackathon, Seminar, etc.
      - `date` (date)
      - `time` (text)
      - `location` (text)
      - `image_url` (text)
      - `organizer` (text)
      - `registration_url` (text)
      - `is_featured` (boolean) default false
      - `created_at` (timestamptz)

  2. Security
    - RLS enabled on all tables
    - Public read access for anon users (educational content)
*/

-- Domains
CREATE TABLE IF NOT EXISTS domains (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  icon text NOT NULL DEFAULT 'folder',
  color text NOT NULL DEFAULT '#3b82f6',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE domains ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read domains"
  ON domains FOR SELECT
  TO anon, authenticated
  USING (true);

-- Videos
CREATE TABLE IF NOT EXISTS videos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  domain_id uuid REFERENCES domains(id) ON DELETE CASCADE,
  title text NOT NULL,
  channel_name text NOT NULL,
  thumbnail_url text NOT NULL,
  video_url text NOT NULL,
  duration text NOT NULL DEFAULT '0:00',
  views integer NOT NULL DEFAULT 0,
  likes integer NOT NULL DEFAULT 0,
  ai_score numeric NOT NULL DEFAULT 0,
  level text NOT NULL DEFAULT 'Beginner',
  tags text[] DEFAULT '{}',
  description text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE videos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read videos"
  ON videos FOR SELECT
  TO anon, authenticated
  USING (true);

-- Courses
CREATE TABLE IF NOT EXISTS courses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  domain_id uuid REFERENCES domains(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text DEFAULT '',
  thumbnail_url text NOT NULL,
  level text NOT NULL DEFAULT 'Beginner',
  video_count integer NOT NULL DEFAULT 0,
  duration_hours numeric NOT NULL DEFAULT 0,
  instructor text NOT NULL,
  rating numeric NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE courses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read courses"
  ON courses FOR SELECT
  TO anon, authenticated
  USING (true);

-- Notes
CREATE TABLE IF NOT EXISTS notes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  domain_id uuid REFERENCES domains(id) ON DELETE CASCADE,
  title text NOT NULL,
  subject text NOT NULL,
  semester integer NOT NULL DEFAULT 1,
  file_url text NOT NULL,
  file_type text NOT NULL DEFAULT 'PDF',
  page_count integer NOT NULL DEFAULT 0,
  uploaded_by text NOT NULL DEFAULT 'Anonymous',
  downloads integer NOT NULL DEFAULT 0,
  description text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE notes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read notes"
  ON notes FOR SELECT
  TO anon, authenticated
  USING (true);

-- PYQs
CREATE TABLE IF NOT EXISTS pyqs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  domain_id uuid REFERENCES domains(id) ON DELETE CASCADE,
  title text NOT NULL,
  subject text NOT NULL,
  year integer NOT NULL,
  semester integer NOT NULL DEFAULT 1,
  exam_type text NOT NULL DEFAULT 'Final',
  file_url text NOT NULL,
  has_solutions boolean NOT NULL DEFAULT false,
  university text NOT NULL DEFAULT '',
  downloads integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE pyqs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read pyqs"
  ON pyqs FOR SELECT
  TO anon, authenticated
  USING (true);

-- Campus Events
CREATE TABLE IF NOT EXISTS campus_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text DEFAULT '',
  event_type text NOT NULL DEFAULT 'Workshop',
  date date NOT NULL,
  time text NOT NULL DEFAULT '10:00 AM',
  location text NOT NULL DEFAULT '',
  image_url text DEFAULT '',
  organizer text NOT NULL DEFAULT '',
  registration_url text DEFAULT '',
  is_featured boolean NOT NULL DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE campus_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read campus events"
  ON campus_events FOR SELECT
  TO anon, authenticated
  USING (true);
