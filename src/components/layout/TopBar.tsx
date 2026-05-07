import { Search, Bell, Sun, Moon, Menu, LogOut } from 'lucide-react';
import { useState } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { useSidebar } from '../../contexts/SidebarContext';
import { useAuth } from '../../contexts/AuthContext';

export default function TopBar() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { toggle } = useSidebar();
  const { user, logout } = useAuth();

  const initials = user?.name
    ? user.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : '?';

  return (
    <header className="h-14 border-b border-[rgb(var(--border-primary))] bg-[rgb(var(--bg-elevated))] sticky top-0 z-40 flex items-center justify-between px-3 sm:px-4 lg:px-6 transition-colors duration-200">
      <div className="flex items-center gap-2 sm:gap-3 flex-1">
        <button
          onClick={toggle}
          className="lg:hidden w-8 h-8 flex items-center justify-center text-[rgb(var(--text-secondary))] hover:text-[rgb(var(--text-primary))] transition-colors"
          aria-label="Toggle menu"
        >
          <Menu className="w-5 h-5" strokeWidth={2} />
        </button>

        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 sm:w-4 sm:h-4 text-[rgb(var(--text-tertiary))]" strokeWidth={2} />
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 sm:pl-10 pr-3 py-1.5 bg-[rgb(var(--bg-base))] border border-[rgb(var(--border-primary))] text-xs sm:text-sm text-[rgb(var(--text-primary))] placeholder-[rgb(var(--text-tertiary))] focus:outline-none focus:border-[rgb(var(--color-primary))] transition-all"
          />
        </div>
      </div>

      <div className="flex items-center gap-1.5 sm:gap-2">
        <button
          onClick={toggleTheme}
          className="w-8 h-8 bg-[rgb(var(--bg-overlay))] border border-[rgb(var(--border-primary))] flex items-center justify-center text-[rgb(var(--text-secondary))] hover:text-[rgb(var(--text-primary))] hover:border-[rgb(var(--color-primary))] transition-all"
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? (
            <Sun className="w-3.5 h-3.5 sm:w-4 sm:h-4" strokeWidth={2} />
          ) : (
            <Moon className="w-3.5 h-3.5 sm:w-4 sm:h-4" strokeWidth={2} />
          )}
        </button>
        <button className="relative w-8 h-8 bg-[rgb(var(--bg-overlay))] border border-[rgb(var(--border-primary))] flex items-center justify-center text-[rgb(var(--text-secondary))] hover:text-[rgb(var(--text-primary))] hover:border-[rgb(var(--color-primary))] transition-all">
          <Bell className="w-3.5 h-3.5 sm:w-4 sm:h-4" strokeWidth={2} />
          <span className="absolute -top-1 -right-1 w-3 h-3 sm:w-3.5 sm:h-3.5 bg-[rgb(var(--color-accent))] text-[8px] sm:text-[9px] text-white flex items-center justify-center font-bold">
            3
          </span>
        </button>

        {/* User Avatar & Menu */}
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="w-8 h-8 bg-[rgb(var(--color-primary))] flex items-center justify-center cursor-pointer border border-[rgb(var(--color-primary))] text-white text-[11px] font-bold"
          >
            {initials}
          </button>
          {showUserMenu && (
            <>
              <div
                className="fixed inset-0 z-50"
                onClick={() => setShowUserMenu(false)}
              />
              <div className="absolute right-0 top-full mt-1 w-48 bg-[rgb(var(--bg-elevated))] border border-[rgb(var(--border-primary))] shadow-lg z-50">
                <div className="px-3 py-2.5 border-b border-[rgb(var(--border-secondary))]">
                  <p className="text-xs font-semibold text-[rgb(var(--text-primary))] truncate">{user?.name}</p>
                  <p className="text-[10px] text-[rgb(var(--text-tertiary))] truncate">{user?.email}</p>
                  {user?.branch && (
                    <p className="text-[9px] text-[rgb(var(--text-tertiary))] uppercase tracking-wider mt-0.5">
                      {user.branch} · Year {user.year}
                    </p>
                  )}
                </div>
                <button
                  onClick={() => { logout(); setShowUserMenu(false); }}
                  className="w-full px-3 py-2 text-left text-xs text-[rgb(var(--text-secondary))] hover:bg-[rgb(var(--bg-overlay))] hover:text-[rgb(var(--text-primary))] flex items-center gap-2 transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" strokeWidth={2} />
                  Sign out
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

