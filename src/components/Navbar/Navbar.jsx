import { NavLink } from 'react-router-dom'

const links = [
  { to: '/', icon: '🏰', label: 'Home' },
  { to: '/combat', icon: '⚔️', label: 'Combattimento' },
  { to: '/party', icon: '👥', label: 'Gruppo' },
  { to: '/monsters', icon: '🐉', label: 'Mostri' },
  { to: '/spells', icon: '✨', label: 'Magie' },
]

export function Navbar() {
  return (
    <nav className="sidebar-nav">
      <div className="sidebar-logo">
        <span className="sidebar-logo-icon">🎲</span>
        <span>D&amp;D Tracker</span>
      </div>
      <div className="sidebar-links">
        {links.map(({ to, icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `sidebar-link ${isActive ? 'active' : ''}`
            }
          >
            <span className="sidebar-link-icon">{icon}</span>
            <span className="sidebar-link-text">{label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
