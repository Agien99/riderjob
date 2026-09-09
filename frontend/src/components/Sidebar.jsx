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
        <div className="sidebar-brand-icon">
          RJ
        </div>

        <div>
          <h1>RiderJob</h1>
          <span>Ride. Track. Improve.</span>
        </div>
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
        <small>Built by a Developer, for Real Life.</small>
      </div>
    </aside>
  )
}

export default Sidebar