import {
  LayoutDashboard,
  BookOpen,
  FileText,
  ClipboardList,
  Building2,
  Play,
} from 'lucide-react';

export const NAV_ITEMS = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/courses', icon: BookOpen, label: 'Courses' },
  { to: '/playlist', icon: Play, label: 'Playlist' },
  { to: '/notes', icon: FileText, label: 'Notes' },
  { to: '/pyqs', icon: ClipboardList, label: 'PYQs' },
  { to: '/campus', icon: Building2, label: 'Campus' },
];
