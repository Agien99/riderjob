import { useState } from 'react'
import {
  Link,
  Navigate,
  useNavigate,
} from 'react-router-dom'

import { useAuth } from '../context/useAuth'
import '../styles/auth.css'

function Register() {
  const navigate = useNavigate()

  const {
    register,
    isAuthenticated,
  } = useAuth()

  const [displayName, setDisplayName] =
    useState('')

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
          <span>CREATE PROFILE</span>

          <h2>Start tracking.</h2>

          <p>
            Create your RiderJob account
            and turn your rider sessions
            into measurable performance.
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
            Display Name
            <input
              type="text"
              value={displayName}
              onChange={(event) =>
                setDisplayName(
                  event.target.value,
                )
              }
              placeholder="Your name"
              minLength="2"
              maxLength="120"
              required
            />
          </label>

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
              placeholder="Minimum 8 characters"
              minLength="8"
              maxLength="128"
              required
            />
          </label>

          <button
            className="auth-submit"
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

      <div className="auth-visual">
        <div>
          <span className="auth-visual-label">
            BUILT FOR RIDERS
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
        </div>
      </div>
    </div>
  )
}

export default Register