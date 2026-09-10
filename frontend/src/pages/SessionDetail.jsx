import {
  useEffect,
  useState,
} from 'react'
import {
  useNavigate,
  useParams,
} from 'react-router-dom'

import {
  getSessionDetail,
} from '../services/sessionService'

import '../styles/sessionDetail.css'


function SessionDetail() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [
    session,
    setSession,
  ] = useState(null)

  const [
    loading,
    setLoading,
  ] = useState(true)

  const [
    error,
    setError,
  ] = useState('')

  useEffect(() => {
    async function loadSession() {
      try {
        setLoading(true)
        setError('')

        const data =
          await getSessionDetail(id)

        setSession(data)
      } catch (err) {
        setError(
          err.message ||
            'Unable to load session.',
        )
      } finally {
        setLoading(false)
      }
    }

    loadSession()
  }, [id])

  function formatPlatform(platform) {
    const labels = {
      shopeefood: 'ShopeeFood',
      grabfood: 'GrabFood',
      lalamove: 'Lalamove',
    }

    return (
      labels[platform] ||
      platform ||
      '-'
    )
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
      new Date(
        `${value}T00:00:00`,
      ),
    )
  }

  function formatDateTime(value) {
    if (!value) {
      return '-'
    }

    return new Intl.DateTimeFormat(
      'en-MY',
      {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      },
    ).format(
      new Date(value),
    )
  }

  function formatMoney(value) {
    const amount = Number(
      value || 0,
    )

    return `RM ${amount.toFixed(2)}`
  }

  function formatNumber(
    value,
    suffix = '',
  ) {
    if (
      value === null ||
      value === undefined
    ) {
      return '-'
    }

    return `${Number(value).toFixed(
      2,
    )}${suffix}`
  }

  function formatDuration(minutes) {
    if (
      minutes === null ||
      minutes === undefined
    ) {
      return '-'
    }

    const totalMinutes =
      Number(minutes)

    const hours = Math.floor(
      totalMinutes / 60,
    )

    const remainingMinutes =
      totalMinutes % 60

    if (hours === 0) {
      return `${remainingMinutes} min`
    }

    return (
      `${hours} hr ` +
      `${remainingMinutes} min`
    )
  }

  if (loading) {
    return (
      <main className="detail-page">
        <div className="detail-state">
          Loading session...
        </div>
      </main>
    )
  }

  if (error || !session) {
    return (
      <main className="detail-page">
        <button
          type="button"
          className="detail-back-button"
          onClick={() =>
            navigate('/sessions')
          }
        >
          ← Back to Sessions
        </button>

        <div className="detail-error">
          {error ||
            'Session not found.'}
        </div>
      </main>
    )
  }

  const metrics =
    session.metrics || {}

  return (
    <main className="detail-page">
      <div className="detail-header">
        <div>
          <button
            type="button"
            className="detail-back-button"
            onClick={() =>
              navigate('/sessions')
            }
          >
            ← Back to Sessions
          </button>

          <p className="detail-eyebrow">
            SESSION REPORT
          </p>

          <h1>
            {formatPlatform(
              session.platform,
            )}{' '}
            Session
          </h1>

          <p>
            {formatDate(
              session.session_date,
            )}
          </p>
        </div>

        <span
          className={
            `detail-platform-badge ` +
            `detail-platform-${session.platform}`
          }
        >
          {formatPlatform(
            session.platform,
          )}
        </span>
      </div>

      <section className="detail-metrics-grid">
        <article className="detail-metric-card">
          <span>
            Net Income
          </span>

          <strong>
            {formatMoney(
              metrics.net_income,
            )}
          </strong>
        </article>

        <article className="detail-metric-card">
          <span>
            Distance
          </span>

          <strong>
            {formatNumber(
              metrics.distance_km,
              ' km',
            )}
          </strong>
        </article>

        <article className="detail-metric-card">
          <span>
            Duration
          </span>

          <strong>
            {formatDuration(
              metrics.duration_minutes,
            )}
          </strong>
        </article>

        <article className="detail-metric-card">
          <span>
            Orders
          </span>

          <strong>
            {session.total_orders}
          </strong>
        </article>
      </section>

      <section className="detail-section">
        <div className="detail-section-header">
          <div>
            <p className="detail-eyebrow">
              PERFORMANCE
            </p>

            <h2>
              Earnings Efficiency
            </h2>
          </div>
        </div>

        <div className="detail-info-grid">
          <div className="detail-info-item">
            <span>
              Income / Hour
            </span>

            <strong>
              {metrics.income_per_hour
                === null
                ? '-'
                : formatMoney(
                    metrics.income_per_hour,
                  )}
            </strong>
          </div>

          <div className="detail-info-item">
            <span>
              Income / Order
            </span>

            <strong>
              {metrics.income_per_order
                === null
                ? '-'
                : formatMoney(
                    metrics.income_per_order,
                  )}
            </strong>
          </div>

          <div className="detail-info-item">
            <span>
              Income / KM
            </span>

            <strong>
              {metrics.income_per_km
                === null
                ? '-'
                : formatMoney(
                    metrics.income_per_km,
                  )}
            </strong>
          </div>
        </div>
      </section>

      <section className="detail-section">
        <div className="detail-section-header">
          <div>
            <p className="detail-eyebrow">
              RIDE INFORMATION
            </p>

            <h2>
              Session Details
            </h2>
          </div>

          <span className="detail-status">
            Completed
          </span>
        </div>

        <div className="detail-info-grid">
          <div className="detail-info-item">
            <span>
              Start Time
            </span>

            <strong>
              {formatDateTime(
                session.start_time,
              )}
            </strong>
          </div>

          <div className="detail-info-item">
            <span>
              End Time
            </span>

            <strong>
              {formatDateTime(
                session.end_time,
              )}
            </strong>
          </div>

          <div className="detail-info-item">
            <span>
              Start Mileage
            </span>

            <strong>
              {formatNumber(
                session.start_mileage,
                ' km',
              )}
            </strong>
          </div>

          <div className="detail-info-item">
            <span>
              End Mileage
            </span>

            <strong>
              {formatNumber(
                session.end_mileage,
                ' km',
              )}
            </strong>
          </div>
        </div>
      </section>

      <section className="detail-section">
        <div className="detail-section-header">
          <div>
            <p className="detail-eyebrow">
              FINANCIAL
            </p>

            <h2>
              Earnings & Expenses
            </h2>
          </div>
        </div>

        <div className="detail-info-grid">
          <div className="detail-info-item">
            <span>
              Gross Income
            </span>

            <strong>
              {formatMoney(
                session.gross_income,
              )}
            </strong>
          </div>

          <div className="detail-info-item">
            <span>
              Fuel Cost
            </span>

            <strong>
              {formatMoney(
                session.fuel_cost,
              )}
            </strong>
          </div>

          <div className="detail-info-item">
            <span>
              Other Expenses
            </span>

            <strong>
              {formatMoney(
                session.other_expenses,
              )}
            </strong>
          </div>

          <div className="detail-info-item">
            <span>
              Net Income
            </span>

            <strong>
              {formatMoney(
                metrics.net_income,
              )}
            </strong>
          </div>
        </div>
      </section>

      <section className="detail-section">
        <div className="detail-section-header">
          <div>
            <p className="detail-eyebrow">
              NOTES
            </p>

            <h2>
              Session Notes
            </h2>
          </div>
        </div>

        <div className="detail-notes">
          {session.notes ||
            'No notes were added for this session.'}
        </div>
      </section>
    </main>
  )
}

export default SessionDetail