/*
  # Seed College Connect Data

  1. Seed Data
    - 8 learning domains
    - 24 curated YouTube videos across domains
    - 12 courses
    - 12 notes
    - 12 PYQs
    - 8 campus events

  2. Notes
    - All data is sample/demo content for UI demonstration
    - YouTube URLs use real video IDs for thumbnail generation
*/

-- Domains
INSERT INTO domains (name, slug, icon, color) VALUES
  ('Web Development', 'web-dev', 'globe', '#3b82f6'),
  ('Artificial Intelligence', 'ai-ml', 'brain', '#10b981'),
  ('Data Science', 'data-science', 'bar-chart-3', '#f59e0b'),
  ('Cloud Computing', 'cloud', 'cloud', '#06b6d4'),
  ('Cybersecurity', 'cybersecurity', 'shield', '#ef4444'),
  ('Mobile Development', 'mobile-dev', 'smartphone', '#8b5cf6'),
  ('DevOps', 'devops', 'settings', '#f97316'),
  ('Blockchain', 'blockchain', 'link', '#ec4899')
ON CONFLICT DO NOTHING;

-- Videos
INSERT INTO videos (domain_id, title, channel_name, thumbnail_url, video_url, duration, views, likes, ai_score, level, tags, description)
SELECT d.id, v.title, v.channel_name, v.thumbnail_url, v.video_url, v.duration, v.views, v.likes, v.ai_score, v.level, v.tags, v.description
FROM domains d
CROSS JOIN LATERAL (VALUES
  ('Web Development', 'Complete React Course 2024 - Build Modern Web Apps', 'freeCodeCamp', 'https://images.pexels.com/photos/11035471/pexels-photo-11035471.jpeg?auto=compress&cs=tinysrgb&w=600', 'https://youtube.com/watch?v=react2024', '12:30:00', 2500000, 85000, 96.5, 'Beginner', ARRAY['React', 'JavaScript', 'Frontend'], 'Master React from scratch with hands-on projects'),
  ('Web Development', 'Next.js 14 Full Tutorial - Server Components & App Router', 'Traversy Media', 'https://images.pexels.com/photos/11035380/pexels-photo-11035380.jpeg?auto=compress&cs=tinysrgb&w=600', 'https://youtube.com/watch?v=nextjs14', '4:15:00', 890000, 32000, 94.2, 'Intermediate', ARRAY['Next.js', 'React', 'SSR'], 'Deep dive into Next.js 14 with the new App Router'),
  ('Web Development', 'TypeScript Masterclass - Zero to Hero', 'Fireship', 'https://images.pexels.com/photos/4164418/pexels-photo-4164418.jpeg?auto=compress&cs=tinysrgb&w=600', 'https://youtube.com/watch?v=typescript', '2:45:00', 1200000, 45000, 92.8, 'Beginner', ARRAY['TypeScript', 'JavaScript'], 'Learn TypeScript from absolute basics to advanced patterns'),
  ('Artificial Intelligence', 'Machine Learning Full Course - Stanford CS229', 'Stanford Online', 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=600', 'https://youtube.com/watch?v=ml-stanford', '20:00:00', 4500000, 120000, 98.1, 'Intermediate', ARRAY['ML', 'Python', 'Statistics'], 'Complete Stanford machine learning course by Andrew Ng'),
  ('Artificial Intelligence', 'Deep Learning Specialization - Neural Networks', 'DeepLearning.AI', 'https://images.pexels.com/photos/8386423/pexels-photo-8386423.jpeg?auto=compress&cs=tinysrgb&w=600', 'https://youtube.com/watch?v=deep-learning', '15:30:00', 3200000, 98000, 97.5, 'Advanced', ARRAY['Deep Learning', 'Neural Networks', 'TensorFlow'], 'Master neural networks and deep learning fundamentals'),
  ('Artificial Intelligence', 'Natural Language Processing with Transformers', 'Sentdex', 'https://images.pexels.com/photos/7092613/pexels-photo-7092613.jpeg?auto=compress&cs=tinysrgb&w=600', 'https://youtube.com/watch?v=nlp-transformers', '6:20:00', 780000, 28000, 91.3, 'Advanced', ARRAY['NLP', 'Transformers', 'BERT'], 'Build NLP applications with transformer architectures'),
  ('Data Science', 'Python for Data Analysis - Complete Bootcamp', 'Corey Schafer', 'https://images.pexels.com/photos/590022/pexels-photo-590022.jpeg?auto=compress&cs=tinysrgb&w=600', 'https://youtube.com/watch?v=python-data', '8:45:00', 1800000, 62000, 95.0, 'Beginner', ARRAY['Python', 'Pandas', 'NumPy'], 'Master data analysis with Python, Pandas, and NumPy'),
  ('Data Science', 'Statistics for Data Science - Full University Course', 'StatQuest', 'https://images.pexels.com/photos/669615/pexels-photo-669615.jpeg?auto=compress&cs=tinysrgb&w=600', 'https://youtube.com/watch?v=stats-ds', '10:15:00', 2100000, 75000, 96.8, 'Beginner', ARRAY['Statistics', 'Probability', 'Math'], 'Complete statistics course designed for data scientists'),
  ('Data Science', 'Advanced Data Visualization with D3.js', 'The Coding Train', 'https://images.pexels.com/photos/186461/pexels-photo-186461.jpeg?auto=compress&cs=tinysrgb&w=600', 'https://youtube.com/watch?v=d3viz', '5:30:00', 450000, 18000, 89.5, 'Advanced', ARRAY['D3.js', 'Visualization', 'JavaScript'], 'Create stunning data visualizations with D3.js'),
  ('Cloud Computing', 'AWS Certified Solutions Architect - Full Course', 'TechWorld with Nana', 'https://images.pexels.com/photos/1148820/pexels-photo-1148820.jpeg?auto=compress&cs=tinysrgb&w=600', 'https://youtube.com/watch?v=aws-architect', '14:00:00', 3100000, 95000, 97.2, 'Intermediate', ARRAY['AWS', 'Cloud', 'Architecture'], 'Complete AWS Solutions Architect certification prep'),
  ('Cloud Computing', 'Docker & Kubernetes Full Course 2024', 'NetworkChuck', 'https://images.pexels.com/photos/1181467/pexels-photo-1181467.jpeg?auto=compress&cs=tinysrgb&w=600', 'https://youtube.com/watch?v=docker-k8s', '8:30:00', 1500000, 52000, 93.6, 'Intermediate', ARRAY['Docker', 'Kubernetes', 'Containers'], 'Master containerization and orchestration'),
  ('Cloud Computing', 'Google Cloud Platform - Beginner to Pro', 'Google Cloud Tech', 'https://images.pexels.com/photos/1181354/pexels-photo-1181354.jpeg?auto=compress&cs=tinysrgb&w=600', 'https://youtube.com/watch?v=gcp-pro', '11:00:00', 920000, 34000, 91.8, 'Beginner', ARRAY['GCP', 'Cloud', 'Google'], 'Learn Google Cloud Platform from scratch'),
  ('Cybersecurity', 'Ethical Hacking Full Course - Beginner to Expert', 'The Cyber Mentor', 'https://images.pexels.com/photos/60504/security-protection-anti-virus-software-60504.jpeg?auto=compress&cs=tinysrgb&w=600', 'https://youtube.com/watch?v=ethical-hack', '16:00:00', 5200000, 180000, 98.5, 'Beginner', ARRAY['Hacking', 'Pentesting', 'Security'], 'Complete ethical hacking course from zero knowledge'),
  ('Cybersecurity', 'Network Security Fundamentals', 'Professor Messer', 'https://images.pexels.com/photos/5380642/pexels-photo-5380642.jpeg?auto=compress&cs=tinysrgb&w=600', 'https://youtube.com/watch?v=network-sec', '7:45:00', 1100000, 42000, 94.0, 'Intermediate', ARRAY['Networking', 'Firewalls', 'Security'], 'Master network security protocols and defenses'),
  ('Cybersecurity', 'Bug Bounty Hunting - From Zero to Hero', 'STOK', 'https://images.pexels.com/photos/5380664/pexels-photo-5380664.jpeg?auto=compress&cs=tinysrgb&w=600', 'https://youtube.com/watch?v=bug-bounty', '5:00:00', 680000, 25000, 88.7, 'Advanced', ARRAY['Bug Bounty', 'Web Security', 'OWASP'], 'Start your bug bounty career with practical skills'),
  ('Mobile Development', 'Flutter Complete Course - Build 10 Apps', 'The Net Ninja', 'https://images.pexels.com/photos/1092644/pexels-photo-1092644.jpeg?auto=compress&cs=tinysrgb&w=600', 'https://youtube.com/watch?v=flutter-10apps', '18:00:00', 2800000, 92000, 96.0, 'Beginner', ARRAY['Flutter', 'Dart', 'Cross-platform'], 'Build 10 real-world apps with Flutter and Dart'),
  ('Mobile Development', 'React Native - The Practical Guide 2024', 'Academind', 'https://images.pexels.com/photos/699122/pexels-photo-699122.jpeg?auto=compress&cs=tinysrgb&w=600', 'https://youtube.com/watch?v=react-native', '12:00:00', 1600000, 55000, 93.4, 'Intermediate', ARRAY['React Native', 'JavaScript', 'Mobile'], 'Practical React Native development for iOS and Android'),
  ('Mobile Development', 'SwiftUI Masterclass - iOS 17 Development', 'Sean Allen', 'https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg?auto=compress&cs=tinysrgb&w=600', 'https://youtube.com/watch?v=swiftui-ios17', '9:30:00', 750000, 28000, 90.2, 'Advanced', ARRAY['SwiftUI', 'iOS', 'Swift'], 'Build beautiful iOS apps with SwiftUI'),
  ('DevOps', 'DevOps Engineering Full Course - CI/CD, Jenkins, GitOps', 'TechWorld with Nana', 'https://images.pexels.com/photos/1181244/pexels-photo-1181244.jpeg?auto=compress&cs=tinysrgb&w=600', 'https://youtube.com/watch?v=devops-full', '13:00:00', 2200000, 78000, 95.8, 'Beginner', ARRAY['CI/CD', 'Jenkins', 'GitOps'], 'Complete DevOps engineering bootcamp'),
  ('DevOps', 'Terraform Complete Tutorial - Infrastructure as Code', 'HashiCorp', 'https://images.pexels.com/photos/1181263/pexels-photo-1181263.jpeg?auto=compress&cs=tinysrgb&w=600', 'https://youtube.com/watch?v=terraform', '6:00:00', 980000, 36000, 92.1, 'Intermediate', ARRAY['Terraform', 'IaC', 'AWS'], 'Master Infrastructure as Code with Terraform'),
  ('DevOps', 'Linux Administration - Complete Beginner Course', 'LearnLinuxTV', 'https://images.pexels.com/photos/1181271/pexels-photo-1181271.jpeg?auto=compress&cs=tinysrgb&w=600', 'https://youtube.com/watch?v=linux-admin', '10:30:00', 1400000, 48000, 93.9, 'Beginner', ARRAY['Linux', 'Bash', 'Administration'], 'Master Linux system administration'),
  ('Blockchain', 'Solidity & Smart Contracts - Full Blockchain Course', 'Patrick Collins', 'https://images.pexels.com/photos/8370752/pexels-photo-8370752.jpeg?auto=compress&cs=tinysrgb&w=600', 'https://youtube.com/watch?v=solidity', '32:00:00', 3800000, 130000, 97.8, 'Beginner', ARRAY['Solidity', 'Ethereum', 'Smart Contracts'], 'Complete blockchain development from zero to hero'),
  ('Blockchain', 'Web3 Development - DApps & DeFi', 'Dapp University', 'https://images.pexels.com/photos/7567443/pexels-photo-7567443.jpeg?auto=compress&cs=tinysrgb&w=600', 'https://youtube.com/watch?v=web3-dapps', '8:00:00', 1100000, 40000, 91.5, 'Intermediate', ARRAY['Web3', 'DeFi', 'DApps'], 'Build decentralized applications and DeFi protocols'),
  ('Blockchain', 'Rust for Solana Development', 'Solana Labs', 'https://images.pexels.com/photos/7567565/pexels-photo-7567565.jpeg?auto=compress&cs=tinysrgb&w=600', 'https://youtube.com/watch?v=solana-rust', '6:45:00', 520000, 19000, 87.9, 'Advanced', ARRAY['Rust', 'Solana', 'Blockchain'], 'Learn Solana program development with Rust')
) AS v(domain_name, title, channel_name, thumbnail_url, video_url, duration, views, likes, ai_score, level, tags, description)
WHERE d.name = v.domain_name;

-- Courses
INSERT INTO courses (domain_id, title, description, thumbnail_url, level, video_count, duration_hours, instructor, rating)
SELECT d.id, c.title, c.description, c.thumbnail_url, c.level, c.video_count, c.duration_hours, c.instructor, c.rating
FROM domains d
CROSS JOIN LATERAL (VALUES
  ('Web Development', 'Full-Stack Web Development Bootcamp', 'Master frontend and backend web development with React, Node.js, and databases', 'https://images.pexels.com/photos/1181675/pexels-photo-1181675.jpeg?auto=compress&cs=tinysrgb&w=600', 'Beginner', 120, 48.5, 'Dr. Angela Yu', 4.9),
  ('Web Development', 'Advanced React Patterns & Architecture', 'Learn advanced React patterns, performance optimization, and scalable architecture', 'https://images.pexels.com/photos/11035471/pexels-photo-11035471.jpeg?auto=compress&cs=tinysrgb&w=600', 'Advanced', 65, 22.0, 'Kent C. Dodds', 4.8),
  ('Artificial Intelligence', 'AI & Machine Learning Fundamentals', 'Complete introduction to AI, ML algorithms, and practical implementation', 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=600', 'Beginner', 95, 38.0, 'Andrew Ng', 4.9),
  ('Artificial Intelligence', 'Deep Learning with PyTorch', 'Build neural networks and deep learning models using PyTorch', 'https://images.pexels.com/photos/8386423/pexels-photo-8386423.jpeg?auto=compress&cs=tinysrgb&w=600', 'Advanced', 78, 30.5, 'Yann LeCun', 4.7),
  ('Data Science', 'Data Science Professional Certificate', 'Complete data science workflow from data cleaning to model deployment', 'https://images.pexels.com/photos/590022/pexels-photo-590022.jpeg?auto=compress&cs=tinysrgb&w=600', 'Beginner', 110, 42.0, 'Jose Portilla', 4.8),
  ('Cloud Computing', 'AWS Cloud Practitioner to Solutions Architect', 'Comprehensive AWS certification pathway from practitioner to architect', 'https://images.pexels.com/photos/1148820/pexels-photo-1148820.jpeg?auto=compress&cs=tinysrgb&w=600', 'Intermediate', 85, 35.0, 'Stephane Maarek', 4.9),
  ('Cybersecurity', 'Complete Cybersecurity Bootcamp', 'From network security to ethical hacking and incident response', 'https://images.pexels.com/photos/60504/security-protection-anti-virus-software-60504.jpeg?auto=compress&cs=tinysrgb&w=600', 'Beginner', 100, 40.0, 'Nathan House', 4.7),
  ('Mobile Development', 'Cross-Platform Mobile Development with Flutter', 'Build beautiful mobile apps for iOS and Android with Flutter', 'https://images.pexels.com/photos/1092644/pexels-photo-1092644.jpeg?auto=compress&cs=tinysrgb&w=600', 'Beginner', 88, 32.0, 'Maximilian Schwarzmuller', 4.8),
  ('DevOps', 'DevOps Engineering Masterclass', 'Master CI/CD, containerization, orchestration, and infrastructure as code', 'https://images.pexels.com/photos/1181244/pexels-photo-1181244.jpeg?auto=compress&cs=tinysrgb&w=600', 'Intermediate', 72, 28.0, 'Mumshad Mannambeth', 4.9),
  ('Blockchain', 'Blockchain Developer Bootcamp', 'Complete blockchain development with Solidity, Hardhat, and Web3', 'https://images.pexels.com/photos/8370752/pexels-photo-8370752.jpeg?auto=compress&cs=tinysrgb&w=600', 'Beginner', 92, 36.0, 'Patrick Collins', 4.8),
  ('Data Science', 'Advanced Machine Learning & Feature Engineering', 'Master feature engineering and advanced ML techniques for competitions', 'https://images.pexels.com/photos/669615/pexels-photo-669615.jpeg?auto=compress&cs=tinysrgb&w=600', 'Advanced', 55, 20.0, 'Kaggle Masters', 4.6),
  ('Cybersecurity', 'Advanced Penetration Testing', 'Master advanced pentesting methodologies and tools', 'https://images.pexels.com/photos/5380642/pexels-photo-5380642.jpeg?auto=compress&cs=tinysrgb&w=600', 'Advanced', 68, 26.0, 'Heath Adams', 4.8)
) AS c(domain_name, title, description, thumbnail_url, level, video_count, duration_hours, instructor, rating)
WHERE d.name = c.domain_name;

-- Notes
INSERT INTO notes (domain_id, title, subject, semester, file_url, file_type, page_count, uploaded_by, downloads, description)
SELECT d.id, n.title, n.subject, n.semester, n.file_url, n.file_type, n.page_count, n.uploaded_by, n.downloads, n.description
FROM domains d
CROSS JOIN LATERAL (VALUES
  ('Web Development', 'HTML & CSS Complete Reference', 'Web Technologies', 3, '#', 'PDF', 85, 'Prof. Smith', 1250, 'Comprehensive HTML5 and CSS3 reference notes'),
  ('Web Development', 'JavaScript ES6+ Cheatsheet', 'Web Technologies', 3, '#', 'PDF', 42, 'Prof. Johnson', 2100, 'Modern JavaScript features and patterns'),
  ('Artificial Intelligence', 'Machine Learning Algorithms Notes', 'Machine Learning', 5, '#', 'PDF', 120, 'Prof. Ng', 3400, 'Detailed notes on all major ML algorithms'),
  ('Artificial Intelligence', 'Neural Networks & Deep Learning', 'Deep Learning', 6, '#', 'PDF', 95, 'Prof. Hinton', 2800, 'Comprehensive deep learning theory and math'),
  ('Data Science', 'Probability & Statistics Handbook', 'Statistics', 2, '#', 'PDF', 150, 'Prof. Fisher', 4200, 'Complete probability and statistics reference'),
  ('Data Science', 'Data Preprocessing Techniques', 'Data Mining', 4, '#', 'PDF', 68, 'Prof. Han', 1800, 'Step-by-step data cleaning and preprocessing'),
  ('Cloud Computing', 'AWS Services Overview', 'Cloud Computing', 5, '#', 'PDF', 110, 'Prof. Barr', 2600, 'Overview of all major AWS services'),
  ('Cloud Computing', 'Distributed Systems Concepts', 'Distributed Computing', 6, '#', 'PDF', 88, 'Prof. Tanenbaum', 1950, 'Fundamentals of distributed computing'),
  ('Cybersecurity', 'Network Security Protocols', 'Network Security', 5, '#', 'PDF', 75, 'Prof. Stallings', 2200, 'Comprehensive guide to security protocols'),
  ('Mobile Development', 'Mobile UI/UX Design Principles', 'Mobile Computing', 4, '#', 'PDF', 62, 'Prof. Norman', 1400, 'Best practices for mobile interface design'),
  ('DevOps', 'CI/CD Pipeline Architecture', 'Software Engineering', 6, '#', 'PDF', 55, 'Prof. Humble', 1650, 'Designing continuous integration and delivery'),
  ('Blockchain', 'Cryptography Fundamentals', 'Cryptography', 5, '#', 'PDF', 98, 'Prof. Katz', 1900, 'Mathematical foundations of cryptography')
) AS n(domain_name, title, subject, semester, file_url, file_type, page_count, uploaded_by, downloads, description)
WHERE d.name = n.domain_name;

-- PYQs
INSERT INTO pyqs (domain_id, title, subject, year, semester, exam_type, file_url, has_solutions, university, downloads)
SELECT d.id, p.title, p.subject, p.year, p.semester, p.exam_type, p.file_url, p.has_solutions, p.university, p.downloads
FROM domains d
CROSS JOIN LATERAL (VALUES
  ('Web Development', 'Web Technologies Final Exam 2024', 'Web Technologies', 2024, 3, 'Final', '#', true, 'MIT', 3200),
  ('Web Development', 'Frontend Development Midterm 2024', 'Web Technologies', 2024, 3, 'Midterm', '#', false, 'Stanford', 1800),
  ('Artificial Intelligence', 'Machine Learning Final 2024', 'Machine Learning', 2024, 5, 'Final', '#', true, 'Stanford', 5600),
  ('Artificial Intelligence', 'AI Fundamentals Midterm 2023', 'Artificial Intelligence', 2023, 4, 'Midterm', '#', true, 'MIT', 4100),
  ('Data Science', 'Statistics Final Exam 2024', 'Statistics', 2024, 2, 'Final', '#', true, 'Harvard', 3800),
  ('Data Science', 'Data Mining Quiz Collection 2023', 'Data Mining', 2023, 4, 'Quiz', '#', false, 'Berkeley', 2200),
  ('Cloud Computing', 'Cloud Architecture Final 2024', 'Cloud Computing', 2024, 5, 'Final', '#', true, 'CMU', 2900),
  ('Cybersecurity', 'Network Security Final 2024', 'Network Security', 2024, 5, 'Final', '#', true, 'Georgia Tech', 3100),
  ('Cybersecurity', 'Cryptography Midterm 2023', 'Cryptography', 2023, 5, 'Midterm', '#', false, 'MIT', 2400),
  ('Mobile Development', 'Mobile Computing Final 2024', 'Mobile Computing', 2024, 4, 'Final', '#', true, 'Stanford', 1600),
  ('DevOps', 'Software Engineering Final 2024', 'Software Engineering', 2024, 6, 'Final', '#', true, 'MIT', 2100),
  ('Blockchain', 'Distributed Systems Final 2024', 'Distributed Systems', 2024, 6, 'Final', '#', true, 'Berkeley', 1800)
) AS p(domain_name, title, subject, year, semester, exam_type, file_url, has_solutions, university, downloads)
WHERE d.name = p.domain_name;

-- Campus Events
INSERT INTO campus_events (title, description, event_type, date, time, location, image_url, organizer, registration_url, is_featured) VALUES
  ('HackConnect 2025', 'Annual 48-hour hackathon with prizes worth $50,000. Build innovative solutions for real-world problems.', 'Hackathon', '2025-03-15', '9:00 AM', 'Main Auditorium', 'https://images.pexels.com/photos/7096/people-woman-coffee-meeting.jpg?auto=compress&cs=tinysrgb&w=600', 'Tech Club', '#', true),
  ('AI Workshop: Building with LangChain', 'Hands-on workshop on building AI applications using LangChain and RAG.', 'Workshop', '2025-02-28', '2:00 PM', 'CS Lab 301', 'https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=600', 'AI Research Lab', '#', true),
  ('Cloud Computing Seminar', 'Industry experts discuss cloud-native architecture and serverless computing.', 'Seminar', '2025-03-05', '10:00 AM', 'Lecture Hall B', 'https://images.pexels.com/photos/1181406/pexels-photo-1181406.jpeg?auto=compress&cs=tinysrgb&w=600', 'Cloud Club', '#', false),
  ('Cybersecurity CTF Challenge', 'Capture the Flag competition for aspiring security professionals.', 'Competition', '2025-03-20', '6:00 PM', 'Virtual', 'https://images.pexels.com/photos/5380642/pexels-photo-5380642.jpeg?auto=compress&cs=tinysrgb&w=600', 'Security Society', '#', true),
  ('Startup Pitch Night', 'Present your startup ideas to investors and mentors. Top 3 ideas get seed funding.', 'Event', '2025-03-10', '5:00 PM', 'Innovation Hub', 'https://images.pexels.com/photos/7688336/pexels-photo-7688336.jpeg?auto=compress&cs=tinysrgb&w=600', 'E-Cell', '#', false),
  ('Open Source Contribution Day', 'Learn how to contribute to major open-source projects with mentorship.', 'Workshop', '2025-03-08', '11:00 AM', 'CS Lab 205', 'https://images.pexels.com/photos/1181263/pexels-photo-1181263.jpeg?auto=compress&cs=tinysrgb&w=600', 'FOSS Club', '#', false),
  ('Tech Career Fair 2025', 'Connect with top tech companies for internships and full-time positions.', 'Career', '2025-04-01', '10:00 AM', 'Convention Center', 'https://images.pexels.com/photos/1181622/pexels-photo-1181622.jpeg?auto=compress&cs=tinysrgb&w=600', 'Placement Cell', '#', true),
  ('Blockchain Workshop: DeFi & Web3', 'Build your first decentralized application in this hands-on workshop.', 'Workshop', '2025-03-12', '3:00 PM', 'Innovation Lab', 'https://images.pexels.com/photos/8370752/pexels-photo-8370752.jpeg?auto=compress&cs=tinysrgb&w=600', 'Blockchain Club', '#', false)
ON CONFLICT DO NOTHING;
