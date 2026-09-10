import {
  useNavigate,
} from 'react-router-dom'

import {
  useAuth,
} from '../context/useAuth'

import '../styles/profile.css'


function Profile() {
  const navigate = useNavigate()

  const {
    user,
    logout,
  } = useAuth()


  function handleLogout() {
    logout()
    navigate('/login')
  }


  function formatDate(value) {
    if (!value) {
      return '-'
    }

    return new Intl.DateTimeFormat(
      'en-MY',
      {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      },
    ).format(
      new Date(value),
    )
  }


  function getInitials() {
    const name =
      user?.display_name?.trim()

    if (name) {
      const words =
        name
          .split(/\s+/)
          .filter(Boolean)

      if (words.length === 1) {
        return words[0]
          .slice(0, 2)
          .toUpperCase()
      }

      return (
        words[0][0] +
        words[
          words.length - 1
        ][0]
      ).toUpperCase()
    }

    if (user?.email) {
      return user.email
        .slice(0, 2)
        .toUpperCase()
    }

    return 'RJ'
  }


  const displayName =
    user?.display_name ||
    'RiderJob User'

  const email =
    user?.email || '-'

  const isActive =
    user?.is_active !== false


  return (
    <main className="profile-page">
      <div className="ui-page-header">
        <div className="ui-page-header-content">
          <span className="ui-page-eyebrow">
            Rider Account
          </span>

          <h1 className="ui-page-title">
            Profile
          </h1>

          <p className="ui-page-subtitle">
            View your RiderJob account
            information and account
            status.
          </p>
        </div>
      </div>


      <section
        className="
          profile-hero
          ui-card
        "
      >
        <div className="profile-identity">
          <div
            className="profile-avatar"
            aria-hidden="true"
          >
            {getInitials()}
          </div>

          <div className="profile-identity-content">
            <span className="ui-page-eyebrow">
              Your Rider Profile
            </span>

            <h2>
              {displayName}
            </h2>

            <p>
              {email}
            </p>

            <div className="profile-badges">
              <span
                className={
                  isActive
                    ? 'ui-badge ui-badge-success'
                    : 'ui-badge ui-badge-danger'
                }
              >
                <span
                  className={
                    isActive
                      ? 'ui-status-dot ui-status-dot-success'
                      : 'ui-status-dot ui-status-dot-danger'
                  }
                />

                {isActive
                  ? 'Active Account'
                  : 'Inactive Account'}
              </span>

              <span
                className="
                  ui-badge
                  ui-badge-primary
                "
              >
                RiderJob Member
              </span>
            </div>
          </div>
        </div>

        <div className="profile-hero-brand">
          <img
            src={
              `${import.meta.env.BASE_URL}` +
              'main-logo-icon.png'
            }
            alt=""
          />

          <div>
            <strong>
              RiderJob
            </strong>

            <span>
              Ride. Track. Improve.
            </span>
          </div>
        </div>
      </section>


      <div className="profile-content-grid">
        <section
          className="
            profile-section
            ui-card
          "
        >
          <div className="profile-section-header">
            <div>
              <span className="ui-page-eyebrow">
                Account Information
              </span>

              <h2>
                Personal Details
              </h2>

              <p>
                Information associated
                with your RiderJob
                account.
              </p>
            </div>
          </div>


          <div className="profile-info-list">
            <div className="profile-info-row">
              <div>
                <span>
                  Display Name
                </span>

                <small>
                  Name shown throughout
                  RiderJob
                </small>
              </div>

              <strong>
                {displayName}
              </strong>
            </div>

            <div className="profile-info-row">
              <div>
                <span>
                  Email Address
                </span>

                <small>
                  Used to sign in to
                  your account
                </small>
              </div>

              <strong>
                {email}
              </strong>
            </div>

            {'created_at' in
              (user || {}) && (
              <div className="profile-info-row">
                <div>
                  <span>
                    Member Since
                  </span>

                  <small>
                    RiderJob account
                    creation date
                  </small>
                </div>

                <strong>
                  {formatDate(
                    user.created_at,
                  )}
                </strong>
              </div>
            )}

            <div className="profile-info-row">
              <div>
                <span>
                  Account Status
                </span>

                <small>
                  Current access status
                </small>
              </div>

              <span
                className={
                  isActive
                    ? 'ui-badge ui-badge-success'
                    : 'ui-badge ui-badge-danger'
                }
              >
                {isActive
                  ? 'Active'
                  : 'Inactive'}
              </span>
            </div>
          </div>
        </section>


        <aside className="profile-side-column">
          <section
            className="
              profile-section
              profile-account-card
              ui-card
            "
          >
            <div className="profile-section-header">
              <div>
                <span className="ui-page-eyebrow">
                  Account
                </span>

                <h2>
                  Session Access
                </h2>
              </div>
            </div>

            <div className="profile-account-status">
              <div className="profile-status-icon">
                <span
                  className={
                    isActive
                      ? 'ui-status-dot ui-status-dot-success'
                      : 'ui-status-dot ui-status-dot-danger'
                  }
                />
              </div>

              <div>
                <strong>
                  {isActive
                    ? 'Account is active'
                    : 'Account is inactive'}
                </strong>

                <p>
                  {isActive
                    ? 'You are currently signed in and can access your rider data.'
                    : 'This account is currently marked as inactive.'}
                </p>
              </div>
            </div>
          </section>


          <section
            className="
              profile-section
              profile-security-card
              ui-card
            "
          >
            <div className="profile-section-header">
              <div>
                <span className="ui-page-eyebrow">
                  Security
                </span>

                <h2>
                  Sign Out
                </h2>

                <p>
                  End your current
                  RiderJob login session
                  on this device.
                </p>
              </div>
            </div>

            <button
              type="button"
              className="
                ui-button
                ui-button-danger
                ui-button-block
              "
              onClick={
                handleLogout
              }
            >
              Sign Out
            </button>
          </section>
        </aside>
      </div>


      <section
        className="
          profile-about
          ui-card
        "
      >
        <div className="profile-about-brand">
          <img
            src={
              `${import.meta.env.BASE_URL}` +
              'main-logo-icon.png'
            }
            alt=""
          />

          <div>
            <span className="ui-page-eyebrow">
              About RiderJob
            </span>

            <h2>
              Built for real-world
              riding.
            </h2>
          </div>
        </div>

        <p>
          RiderJob helps you record
          rider sessions, track
          earnings and expenses, and
          understand how efficiently
          your part-time riding
          performs.
        </p>

        <span className="profile-signature">
          Built by a Developer, for
          Real Life.
        </span>
      </section>
    </main>
  )
}


export default Profile