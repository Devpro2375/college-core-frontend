import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopBar from './TopBar';

export default function Layout() {
  return (
    <div className="min-h-screen bg-[rgb(var(--bg-base))] text-[rgb(var(--text-primary))] transition-colors duration-200">
      <Sidebar />
      <div className="lg:ml-64">
        <TopBar />
        <main className="px-3 py-4 sm:px-4 sm:py-5 lg:px-6 lg:py-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
