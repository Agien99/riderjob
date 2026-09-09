import {
  useEffect,
  useRef,
  useState,
} from 'react'
import {
  useLocation,
  useNavigate,
} from 'react-router-dom'

import { useAuth } from '../context/useAuth'

const pageTitles = {
  '/dashboard': {
    title: 'Dashboard',
    description: 'Your rider performance at a glance.',
  },
  '/session/start': {
    title: 'Start Ride',
    description: 'Start a new rider session.',
  },
  '/session/active': {
    title: 'Active Session',
    description: 'Track your current rider session.',
  },
  '/sessions': {
    title: 'Session History',
    description: 'Review your previous rider sessions.',
  },
  '/analytics': {
    title: 'Analytics',
    description: 'Understand your rider performance.',
  },
  '/profile': {
    title: 'Profile',
    description: 'Manage your RiderJob account.',
  },
}

function getPageInformation(pathname) {
  if (pathname.startsWith('/sessions/')) {
    return {
      title: 'Session Detail',
      description: 'Review rider session information.',
    }
  }

  return (
    pageTitles[pathname] || {
      title: 'RiderJob',
      description: 'Ride. Track. Improve.',
    }
  )
}

function getInitials(displayName) {
  if (!displayName) {
    return 'RJ'
  }

  return displayName
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase()
}

function AppHeader() {
  const location = useLocation()
  const navigate = useNavigate()

  const {
    user,
    logout,
  } = useAuth()

  const [menuOpen, setMenuOpen] =
    useState(false)

  const menuRef = useRef(null)

  const page = getPageInformation(
    location.pathname,
  )

  useEffect(() => {
    function handleOutsideClick(event) {
      if (
        menuRef.current &&
        !menuRef.current.contains(
          event.target,
        )
      ) {
        setMenuOpen(false)
      }
    }

    document.addEventListener(
      'mousedown',
      handleOutsideClick,
    )

    return () => {
      document.removeEventListener(
        'mousedown',
        handleOutsideClick,
      )
    }
  }, [])

  function handleLogout() {
    logout()
    setMenuOpen(false)

    navigate(
      '/login',
      {
        replace: true,
      },
    )
  }

  function handleProfile() {
    setMenuOpen(false)
    navigate('/profile')
  }

  return (
    <header className="app-header">
      <div>
        <h2>{page.title}</h2>
        <p>{page.description}</p>
      </div>

      <div className="app-header-actions">
        <div className="app-header-status">
          <span className="status-dot" />
          <span>System Online</span>
        </div>

        <div
          className="profile-menu"
          ref={menuRef}
        >
          <button
            className="profile-button"
            type="button"
            aria-label="Open account menu"
            aria-expanded={menuOpen}
            onClick={() =>
              setMenuOpen(
                (current) => !current,
              )
            }
          >
            {getInitials(
              user?.display_name,
            )}
          </button>

          {menuOpen && (
            <div className="profile-dropdown">
              <div className="profile-dropdown-user">
                <strong>
                  {user?.display_name}
                </strong>

                <span>
                  {user?.email}
                </span>
              </div>

              <button
                type="button"
                onClick={handleProfile}
              >
                Profile
              </button>

              <button
                type="button"
                className="profile-dropdown-logout"
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

export default AppHeader