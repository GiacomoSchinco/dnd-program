import { NavLink } from 'react-router-dom'

const links = [
  { to: '/', icon: '🏰', label: 'Home' },
  { to: '/combat', icon: '⚔️', label: 'Combattimento' },
  { to: '/party', icon: '📚', label: 'Campagne' },
  { to: '/monsters', icon: '🐉', label: 'Mostri' },
  { to: '/spells', icon: '✨', label: 'Magie' },
]

export function Navbar({ collapsed = false }) {
  return (
    <nav className={`sidebar-nav ${collapsed ? 'collapsed' : ''}`}>
      <div className={`sidebar-logo ${collapsed ? 'collapsed' : ''}`}>
        <span className="sidebar-logo-icon">🎲</span>
        {!collapsed && <span>D&amp;D Tracker</span>}
      </div>
      <div className="sidebar-links">
        {links.map(({ to, icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `sidebar-link ${collapsed ? 'collapsed' : ''} ${isActive ? 'active' : ''}`
            }
            title={label}
          >
            <span className="sidebar-link-icon">{icon}</span>
            {!collapsed && <span className="sidebar-link-text">{label}</span>}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
