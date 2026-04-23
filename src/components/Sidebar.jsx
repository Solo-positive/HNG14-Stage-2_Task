import { useTheme } from '../context/ThemeContext';
import './Sidebar.css';

export default function Sidebar() {
  const { theme, toggleTheme } = useTheme();

  return (
    <aside className="sidebar" role="navigation" aria-label="App sidebar">
      <div className="sidebar__logo" aria-label="Invoice App">
        <span className="sidebar__logo-icon" aria-hidden="true">
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M14 0L28 14L14 28L0 14L14 0Z" fill="white" fillOpacity="0.5"/>
            <path d="M14 7L21 14L14 21L7 14L14 7Z" fill="white"/>
          </svg>
        </span>
      </div>

      <div className="sidebar__bottom">
        <button
          className="sidebar__icon-btn"
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        >
          {theme === 'dark' ? (
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M10 2V1M10 19v-1M2 10H1m18 0h-1M4.22 4.22l-.71-.71m12.02 12.02l-.71-.71M4.22 15.78l-.71.71M16.95 4.93l-.71.71" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <circle cx="10" cy="10" r="4" stroke="currentColor" strokeWidth="2"/>
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          )}
        </button>

        <div className="sidebar__divider" aria-hidden="true" />

        <div className="sidebar__avatar" aria-label="User avatar" role="img">
          <span aria-hidden="true">👤</span>
        </div>
      </div>
    </aside>
  );
}
