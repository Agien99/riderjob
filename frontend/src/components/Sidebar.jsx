import { NavLink } from 'react-router-dom'

import NavigationIcon
  from './NavigationIcon'

const navigation = [
  {
    label: 'Dashboard',
    path: '/dashboard',
    icon: 'dashboard',
  },
  {
    label: 'Start Ride',
    path: '/session/start',
    icon: 'ride',
  },
  {
    label: 'Sessions',
    path: '/sessions',
    icon: 'sessions',
  },
  {
    label: 'Analytics',
    path: '/analytics',
    icon: 'analytics',
  },
  {
    label: 'Profile',
    path: '/profile',
    icon: 'profile',
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

      <nav
        className="sidebar-navigation"
        aria-label="Main navigation"
      >
        {navigation.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `sidebar-link ${
                isActive
                  ? 'sidebar-link-active'
                  : ''
              }`
            }
          >
            <span
              className="sidebar-link-icon"
              aria-hidden="true"
            >
              <NavigationIcon
                name={item.icon}
              />
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