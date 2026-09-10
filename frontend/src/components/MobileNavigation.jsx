import { NavLink } from 'react-router-dom'

import NavigationIcon
  from './NavigationIcon'

const navigation = [
  {
    label: 'Home',
    path: '/dashboard',
    icon: 'dashboard',
  },
  {
    label: 'Ride',
    path: '/session/start',
    icon: 'ride',
  },
  {
    label: 'History',
    path: '/sessions',
    icon: 'sessions',
  },
  {
    label: 'Stats',
    path: '/analytics',
    icon: 'analytics',
  },
  {
    label: 'Profile',
    path: '/profile',
    icon: 'profile',
  },
]

function MobileNavigation() {
  return (
    <nav
      className="mobile-navigation"
      aria-label="Mobile navigation"
    >
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
          <span
            className="mobile-navigation-icon"
            aria-hidden="true"
          >
            <NavigationIcon
              name={item.icon}
              size={19}
            />
          </span>

          <span>{item.label}</span>
        </NavLink>
      ))}
    </nav>
  )
}

export default MobileNavigation