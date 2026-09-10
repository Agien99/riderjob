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


function Login() {
  const navigate = useNavigate()

  const {
    login,
    isAuthenticated,
  } = useAuth()

  const [email, setEmail] =
    useState('')

  const [password, setPassword] =
    useState('')

  const [error, setError] =
    useState('')

  const [submitting, setSubmitting] =
    useState(false)


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

      await login(
        email,
        password,
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
          'Unable to sign in.',
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
              Rider Access
            </span>

            <h1>
              Welcome back.
            </h1>

            <p>
              Sign in to continue
              tracking your rider
              performance.
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
                htmlFor="loginEmail"
              >
                Email
              </label>

              <input
                className="ui-input"
                id="loginEmail"
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
                htmlFor="loginPassword"
              >
                Password
              </label>

              <input
                className="ui-input"
                id="loginPassword"
                type="password"
                value={password}
                onChange={(event) =>
                  setPassword(
                    event.target.value,
                  )
                }
                placeholder="Enter your password"
                autoComplete="current-password"
                disabled={submitting}
                required
              />
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
                ? 'Signing in...'
                : 'Sign In'}
            </button>
          </form>

          <p className="auth-switch">
            New to RiderJob?{' '}

            <Link to="/register">
              Create account
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
            Rider Intelligence
          </span>

          <h2>
            Turn every ride into
            useful data.
          </h2>

          <p>
            Track earnings, distance,
            orders and performance
            across your rider platforms.
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


export default Login