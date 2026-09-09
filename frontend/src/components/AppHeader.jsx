import { useLocation } from 'react-router-dom'

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

function AppHeader() {
  const location = useLocation()

  const page = getPageInformation(
    location.pathname,
  )

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

        <button
          className="profile-button"
          type="button"
          aria-label="Open profile"
        >
          AG
        </button>
      </div>
    </header>
  )
}

export default AppHeader