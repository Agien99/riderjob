import { useState } from 'react'
import {
  Link,
  Navigate,
  useNavigate,
} from 'react-router-dom'

import { useAuth } from '../context/useAuth'
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
    setSubmitting(true)

    try {
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
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-panel">
        <div className="auth-brand">
          <div className="auth-logo">
            RJ
          </div>

          <div>
            <h1>RiderJob</h1>
            <p>
              Ride. Track. Improve.
            </p>
          </div>
        </div>

        <div className="auth-heading">
          <span>RIDER ACCESS</span>

          <h2>Welcome back.</h2>

          <p>
            Sign in to continue tracking
            your rider performance.
          </p>
        </div>

        <form
          className="auth-form"
          onSubmit={handleSubmit}
        >
          {error && (
            <div className="auth-error">
              {error}
            </div>
          )}

          <label>
            Email
            <input
              type="email"
              value={email}
              onChange={(event) =>
                setEmail(
                  event.target.value,
                )
              }
              placeholder="you@example.com"
              required
            />
          </label>

          <label>
            Password
            <input
              type="password"
              value={password}
              onChange={(event) =>
                setPassword(
                  event.target.value,
                )
              }
              placeholder="Enter your password"
              required
            />
          </label>

          <button
            className="auth-submit"
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

      <div className="auth-visual">
        <div>
          <span className="auth-visual-label">
            RIDER INTELLIGENCE
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
        </div>
      </div>
    </div>
  )
}

export default Login