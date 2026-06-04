import { NavLink } from 'react-router-dom';
import { Home, Swords, Users, BookOpen, Skull, User, Sparkles, Settings, Dices } from 'lucide-react';

interface NavLinkItem {
  to: string;
  icon: React.ComponentType<{ size?: number }>;
  label: string;
}

const links: NavLinkItem[] = [
  { to: '/', icon: Home, label: 'Home' },
  { to: '/campaigns', icon: Swords, label: 'Hub Combattimento' },
  { to: '/party', icon: Users, label: 'Party' },
  { to: '/campaign-management', icon: BookOpen, label: 'Campagne' },
  { to: '/monsters', icon: Skull, label: 'Mostri' },
  { to: '/npcs', icon: User, label: 'NPC' },
  { to: '/spells', icon: Sparkles, label: 'Magie' },
  { to: '/settings', icon: Settings, label: 'Impostazioni' },
];

interface NavbarProps {
  collapsed?: boolean;
}

export function Navbar({ collapsed = false }: NavbarProps) {
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
        <Dices size={24} className="text-primary" />
        {!collapsed && <span>D&amp;D Tracker</span>}
      </div>

      {/* Links */}
      <div className={`flex flex-col gap-[0.35rem] w-full ${collapsed ? 'items-center' : ''}`}>
        {links.map(({ to, icon: Icon, label }) => (
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
            <Icon size={20} />
            {!collapsed && <span className="text-[0.7rem] opacity-90">{label}</span>}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}