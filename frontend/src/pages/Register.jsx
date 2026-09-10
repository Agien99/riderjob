import { useState } from 'react'

import {
  Link,
  Navigate,
  useNavigate,
} from 'react-router-dom'

import {
  useAuth,
} from '../context/useAuth'

import '../styles/auth.css'


function Register() {
  const navigate = useNavigate()

  const {
    register,
    isAuthenticated,
  } = useAuth()

  const [
    displayName,
    setDisplayName,
  ] = useState('')

  const [email, setEmail] =
    useState('')

  const [password, setPassword] =
    useState('')

  const [error, setError] =
    useState('')

  const [
    submitting,
    setSubmitting,
  ] = useState(false)


  if (isAuthenticated) {
    return (
      <Navigate
        to="/dashboard"
        replace
      />
    )
  }


  async function handleSubmit(event) {
    event.preventDefault()

    setError('')

    try {
      setSubmitting(true)

      await register(
        email,
        password,
        displayName,
      )

      navigate(
        '/dashboard',
        {
          replace: true,
        },
      )
    } catch (err) {
      setError(
        err.message ||
          'Unable to create account.',
      )
    } finally {
      setSubmitting(false)
    }
  }


  return (
    <main className="auth-page">
      <section className="auth-panel">
        <div className="auth-panel-content">
          <div className="auth-brand">
            <img
              src={`${import.meta.env.BASE_URL}main-logo-icon.png`}
              alt="RiderJob"
              className="auth-brand-logo"
            />
          </div>

          <div className="auth-heading">
            <span className="ui-page-eyebrow">
              Create Profile
            </span>

            <h1>
              Start tracking.
            </h1>

            <p>
              Create your RiderJob
              account and turn your
              rider sessions into
              measurable performance.
            </p>
          </div>

          <form
            className="auth-form"
            onSubmit={handleSubmit}
          >
            {error && (
              <div
                className="
                  ui-alert
                  ui-alert-error
                "
                role="alert"
              >
                {error}
              </div>
            )}

            <div className="ui-field">
              <label
                className="ui-field-label"
                htmlFor="registerName"
              >
                Display Name
              </label>

              <input
                className="ui-input"
                id="registerName"
                type="text"
                value={displayName}
                onChange={(event) =>
                  setDisplayName(
                    event.target.value,
                  )
                }
                placeholder="Your name"
                autoComplete="name"
                minLength="2"
                maxLength="120"
                disabled={submitting}
                required
              />
            </div>

            <div className="ui-field">
              <label
                className="ui-field-label"
                htmlFor="registerEmail"
              >
                Email
              </label>

              <input
                className="ui-input"
                id="registerEmail"
                type="email"
                value={email}
                onChange={(event) =>
                  setEmail(
                    event.target.value,
                  )
                }
                placeholder="you@example.com"
                autoComplete="email"
                disabled={submitting}
                required
              />
            </div>

            <div className="ui-field">
              <label
                className="ui-field-label"
                htmlFor="registerPassword"
              >
                Password
              </label>

              <input
                className="ui-input"
                id="registerPassword"
                type="password"
                value={password}
                onChange={(event) =>
                  setPassword(
                    event.target.value,
                  )
                }
                placeholder="Minimum 8 characters"
                autoComplete="new-password"
                minLength="8"
                maxLength="128"
                disabled={submitting}
                required
              />

              <span className="ui-field-hint">
                Use at least 8 characters.
              </span>
            </div>

            <button
              className="
                ui-button
                ui-button-primary
                ui-button-block
              "
              type="submit"
              disabled={submitting}
            >
              {submitting
                ? 'Creating account...'
                : 'Create Account'}
            </button>
          </form>

          <p className="auth-switch">
            Already registered?{' '}

            <Link to="/login">
              Sign in
            </Link>
          </p>
        </div>
      </section>

      <aside
        className="auth-visual"
        aria-label="RiderJob introduction"
      >
        <div className="auth-visual-content">
          <span className="auth-visual-label">
            Built for Riders
          </span>

          <h2>
            Your work. Your numbers.
            Your progress.
          </h2>

          <p>
            One dashboard for
            ShopeeFood, GrabFood and
            Lalamove.
          </p>

          <div className="auth-platforms">
            <span className="auth-platform auth-platform-shopee">
              ShopeeFood
            </span>

            <span className="auth-platform auth-platform-grab">
              GrabFood
            </span>

            <span className="auth-platform auth-platform-lalamove">
              Lalamove
            </span>
          </div>
        </div>
      </aside>
    </main>
  )
}


export default Register