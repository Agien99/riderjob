import { NavLink } from 'react-router-dom'

const navigation = [
  {
    label: 'Dashboard',
    path: '/dashboard',
    icon: '⌂',
  },
  {
    label: 'Start Ride',
    path: '/session/start',
    icon: '▶',
  },
  {
    label: 'Sessions',
    path: '/sessions',
    icon: '☰',
  },
  {
    label: 'Analytics',
    path: '/analytics',
    icon: '◫',
  },
  {
    label: 'Profile',
    path: '/profile',
    icon: '○',
  },
]

function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <img
          src={`${import.meta.env.BASE_URL}main-logo-icon.png`}
          alt="RiderJob"
          className="sidebar-brand-logo"
        />
      </div>

      <nav className="sidebar-navigation">
        {navigation.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `sidebar-link ${
                isActive ? 'sidebar-link-active' : ''
              }`
            }
          >
            <span className="sidebar-link-icon">
              {item.icon}
            </span>

            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <span>RiderJob</span>
        <small>
          Built by a Developer, for Real Life.
        </small>
      </div>
    </aside>
  )
}

export default Sidebar