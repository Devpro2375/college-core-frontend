import { NavLink } from 'react-router-dom';
import { GraduationCap, X } from 'lucide-react';
import { useSidebar } from '../../contexts/SidebarContext';
import { NAV_ITEMS } from '../../constants/navigation';

export default function Sidebar() {
  const { isOpen, close } = useSidebar();

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={close}
        />
      )}

      <aside
        className={`fixed left-0 top-0 h-screen w-64 border-r border-[rgb(var(--border-primary))] bg-[rgb(var(--bg-elevated))] flex flex-col z-50 transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex items-center justify-between px-4 h-14 border-b border-[rgb(var(--border-primary))]">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-[rgb(var(--color-primary))] flex items-center justify-center">
              <GraduationCap className="w-4 h-4 text-white" />
            </div>
            <div>
              <h1 className="text-xs font-bold text-[rgb(var(--text-primary))] tracking-tight uppercase">
                College Core
              </h1>
              <p className="text-[9px] text-[rgb(var(--text-tertiary))] font-medium uppercase tracking-wider">
                AI Learning
              </p>
            </div>
          </div>
          <button
            onClick={close}
            className="lg:hidden w-7 h-7 flex items-center justify-center text-[rgb(var(--text-secondary))] hover:text-[rgb(var(--text-primary))] transition-colors"
          >
            <X className="w-4 h-4" strokeWidth={2} />
          </button>
        </div>

        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              onClick={() => window.innerWidth < 1024 && close()}
              className={({ isActive }) =>
                `flex items-center gap-2.5 px-3 py-2 text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-[rgb(var(--color-primary))] text-white'
                    : 'text-[rgb(var(--text-secondary))] hover:bg-[rgb(var(--bg-overlay))] hover:text-[rgb(var(--text-primary))]'
                }`
              }
            >
              <item.icon className="w-4 h-4" strokeWidth={2} />
              <span className="tracking-wide">{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="px-3 py-2.5 border-t border-[rgb(var(--border-primary))]">
          <div className="text-[9px] text-[rgb(var(--text-tertiary))] uppercase tracking-wider font-medium text-center">
            Powered by AI
          </div>
        </div>
      </aside>
    </>
  );
}
