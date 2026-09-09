import { NavLink } from 'react-router-dom'

const navigation = [
  {
    label: 'Home',
    path: '/dashboard',
    icon: '⌂',
  },
  {
    label: 'Ride',
    path: '/session/start',
    icon: '▶',
  },
  {
    label: 'History',
    path: '/sessions',
    icon: '☰',
  },
  {
    label: 'Stats',
    path: '/analytics',
    icon: '◫',
  },
  {
    label: 'Profile',
    path: '/profile',
    icon: '○',
  },
]

function MobileNavigation() {
  return (
    <nav className="mobile-navigation">
      {navigation.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          className={({ isActive }) =>
            `mobile-navigation-link ${
              isActive
                ? 'mobile-navigation-link-active'
                : ''
            }`
          }
        >
          <span className="mobile-navigation-icon">
            {item.icon}
          </span>

          <span>{item.label}</span>
        </NavLink>
      ))}
    </nav>
  )
}

export default MobileNavigation