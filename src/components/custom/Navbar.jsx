import { NavLink } from 'react-router-dom';
import { ResetButton } from './ResetButton';
import { ThemeSwitcher } from './ThemeSwitcher';

const links = [
  { to: '/', icon: '🏰', label: 'Home' },
  { to: '/campaigns', icon: '⚔️', label: 'Hub Combattimento' },
  { to: '/party', icon: '👥', label: 'Party' },
  { to: '/campaign-management', icon: '📚', label: 'Campagne' },
  { to: '/monsters', icon: '🐉', label: 'Mostri' },
  { to: '/npcs', icon: '👤', label: 'NPC' },
  { to: '/spells', icon: '✨', label: 'Magie' },
];

export function Navbar({ collapsed = false }) {
  return (
    <nav
      className={`flex flex-col gap-2 px-[0.35rem] min-h-full text-base-content ${collapsed ? 'items-center' : ''}`}
    >
      {/* Logo Header */}
      <div
        className={`
          flex items-center justify-center flex-col gap-[0.3rem]
          font-bold text-[0.85rem] py-3 px-2
          border-b border-base-300/70 mb-2 text-center min-h-[72px]
          ${collapsed ? 'py-[0.55rem] px-0' : ''}
        `}
      >
        <span className="text-[1.5rem] text-primary">🎲</span>
        {!collapsed && <span>D&amp;D Tracker</span>}
      </div>

      {/* Links */}
      <div className={`flex flex-col gap-[0.35rem] w-full ${collapsed ? 'items-center' : ''}`}>
        {links.map(({ to, icon, label }) => (
          <NavLink
            key={`${to}-${label}`}
            to={to}
            end={to === '/'}
            className={({ isActive }) => {
              const baseClasses = `
                flex items-center gap-[0.35rem] p-[0.6rem] rounded-md
                text-base-content no-underline text-[0.8rem]
                transition-all duration-200
                border cursor-pointer flex-col text-center whitespace-nowrap min-h-[66px] justify-center
                ${collapsed ? 'w-14 min-h-14 p-[0.45rem] rounded-2xl mx-auto' : 'w-full'}
              `;
              
              const activeClasses = isActive
                ? 'font-semibold bg-primary text-primary-content border-primary/80 shadow-sm'
                : 'border-transparent bg-base-100/10 hover:bg-base-200 hover:border-base-300 text-base-content';
              
              return `${baseClasses} ${activeClasses}`;
            }}
            title={label}
          >
            <span className="text-[1.3rem] leading-none">{icon}</span>
            {!collapsed && <span className="text-[0.7rem] opacity-90">{label}</span>}
          </NavLink>
        ))}
      </div>

      <div className="mt-auto pt-4 flex flex-col gap-2 items-center w-full">
        <ThemeSwitcher collapsed={collapsed} />
        <ResetButton collapsed={collapsed} />
      </div>
    </nav>
  );
}