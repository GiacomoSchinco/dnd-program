import { NavLink } from 'react-router-dom';
import { ResetButton } from './ResetButton';
import { ThemeSwitcher } from './ThemeSwitcher';

const links = [
  { to: '/', icon: '🏰', label: 'Home' },
  { to: '/combat', icon: '⚔️', label: 'Combattimento' },
  { to: '/party', icon: '📚', label: 'Campagne' },
  { to: '/monsters', icon: '🐉', label: 'Mostri' },
  { to: '/spells', icon: '✨', label: 'Magie' },
];

export function Navbar({ collapsed = false }) {
  return (
    <nav className={`flex flex-col gap-2 px-1 min-h-full text-base-content ${collapsed ? 'items-center' : ''}`}>
      {/* Logo Header */}
      <div
        className={`
          flex items-center justify-center flex-col gap-1 
          font-bold text-sm py-3 px-2 
          border-b border-base-300 mb-2 text-center
          ${collapsed ? 'py-2 px-0' : ''}
        `}
      >
        <span className="text-2xl text-primary">🎲</span>
        {!collapsed && <span className="text-base-content">D&amp;D Tracker</span>}
      </div>

      {/* Links */}
      <div className="flex flex-col gap-1">
        {links.map(({ to, icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) => {
              const baseClasses = `
                flex items-center gap-1 p-3 rounded-lg 
                text-base-content no-underline text-sm 
                transition-all duration-200 
                border border-base-300/70 cursor-pointer flex-col text-center
                ${collapsed ? 'w-14 min-h-14 p-2 rounded-2xl' : 'min-h-[66px] justify-center'}
              `;
              
              const activeClasses = isActive
                ? 'bg-primary text-primary-content border-primary shadow-inner'
                : 'bg-base-200/40 hover:bg-base-300/70 hover:border-base-300';
              
              return `${baseClasses} ${activeClasses}`;
            }}
            title={label}
          >
            <span className="text-xl leading-none">{icon}</span>
            {!collapsed && <span className="text-xs text-base-content/90">{label}</span>}
          </NavLink>
        ))}
      </div>

      <div className="mt-auto pt-4 flex flex-col gap-2 items-center w-full">
        <ThemeSwitcher />
        <ResetButton />
      </div>
    </nav>
  );
}