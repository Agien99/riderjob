import {
  useEffect,
  useState,
} from 'react'

import {
  useNavigate,
} from 'react-router-dom'

import {
  getDashboard,
} from '../services/dashboardService'

import '../styles/dashboard.css'


const PERIODS = [
  {
    value: 'today',
    label: 'Today',
  },
  {
    value: 'week',
    label: 'This Week',
  },
  {
    value: 'month',
    label: 'This Month',
  },
]


const platformLabels = {
  shopeefood: 'ShopeeFood',
  grabfood: 'GrabFood',
  lalamove: 'Lalamove',
}


function Dashboard() {
  const navigate = useNavigate()

  const [
    period,
    setPeriod,
  ] = useState('today')

  const [
    dashboard,
    setDashboard,
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
    let cancelled = false

    getDashboard(period)
      .then((data) => {
        if (cancelled) {
          return
        }

        setDashboard(data)
        setError('')
      })
      .catch((err) => {
        if (cancelled) {
          return
        }

        setError(
          err.message ||
            'Unable to load dashboard.',
        )
      })
      .finally(() => {
        if (cancelled) {
          return
        }

        setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [period])


  function handlePeriodChange(
    nextPeriod,
  ) {
    if (nextPeriod === period) {
      return
    }

    setLoading(true)
    setError('')
    setPeriod(nextPeriod)
  }


  async function handleRetry() {
    try {
      setLoading(true)
      setError('')

      const data =
        await getDashboard(period)

      setDashboard(data)
    } catch (err) {
      setError(
        err.message ||
          'Unable to load dashboard.',
      )
    } finally {
      setLoading(false)
    }
  }


  function formatMoney(value) {
    const amount = Number(
      value || 0,
    )

    return `RM ${amount.toFixed(2)}`
  }


  function formatNumber(
    value,
    decimals = 2,
  ) {
    const amount = Number(
      value || 0,
    )

    return amount.toFixed(decimals)
  }


  function formatHours(value) {
    const hours = Number(
      value || 0,
    )

    if (hours <= 0) {
      return '0 hr'
    }

    const totalMinutes =
      Math.round(
        hours * 60,
      )

    const wholeHours =
      Math.floor(
        totalMinutes / 60,
      )

    const minutes =
      totalMinutes % 60

    if (wholeHours === 0) {
      return `${minutes} min`
    }

    if (minutes === 0) {
      return `${wholeHours} hr`
    }

    return (
      `${wholeHours} hr ` +
      `${minutes} min`
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


  function formatPlatform(platform) {
    return (
      platformLabels[platform] ||
      platform ||
      '-'
    )
  }


  function getPlatformBadgeClass(
    platform,
  ) {
    const classes = {
      shopeefood:
        'ui-badge-shopeefood',
      grabfood:
        'ui-badge-grabfood',
      lalamove:
        'ui-badge-lalamove',
    }

    return (
      classes[platform] ||
      'ui-badge-primary'
    )
  }


  function getPeriodLabel() {
    return (
      PERIODS.find(
        (item) =>
          item.value === period,
      )?.label || 'Today'
    )
  }


  const metrics =
    dashboard?.metrics

  const platformSummary =
    dashboard?.platform_summary || []

  const recentSessions =
    dashboard?.recent_sessions || []


  return (
    <main className="dashboard-page">
      <div className="ui-page-header">
        <div className="ui-page-header-content">
          <span className="ui-page-eyebrow">
            Rider Performance
          </span>

          <h1 className="ui-page-title">
            Dashboard
          </h1>

          <p className="ui-page-subtitle">
            Track your earnings,
            activity and riding
            efficiency.
          </p>
        </div>

        <div className="ui-page-actions">
          <button
            type="button"
            className="
              ui-button
              ui-button-primary
            "
            onClick={() =>
              navigate(
                '/session/start',
              )
            }
          >
            + Start Session
          </button>
        </div>
      </div>


      <section className="dashboard-period-section">
        <div
          className="dashboard-period-tabs"
          aria-label="Dashboard period"
        >
          {PERIODS.map(
            (item) => (
              <button
                key={item.value}
                type="button"
                className={
                  period === item.value
                    ? 'dashboard-period-button dashboard-period-button-active'
                    : 'dashboard-period-button'
                }
                aria-pressed={
                  period === item.value
                }
                onClick={() =>
                  handlePeriodChange(
                    item.value,
                  )
                }
              >
                {item.label}
              </button>
            ),
          )}
        </div>

        {dashboard && (
          <span className="dashboard-period-range">
            {formatDate(
              dashboard.start_date,
            )}

            <span aria-hidden="true">
              {' — '}
            </span>

            {formatDate(
              dashboard.end_date,
            )}
          </span>
        )}
      </section>


      {error && (
        <div
          className="
            ui-state
            ui-state-error
          "
          role="alert"
        >
          <h2>
            Unable to Load Dashboard
          </h2>

          <p>
            {error}
          </p>

          <button
            type="button"
            className="
              ui-button
              ui-button-danger
              ui-button-sm
            "
            onClick={handleRetry}
          >
            Try Again
          </button>
        </div>
      )}


      {loading && (
        <div
          className="ui-state"
          aria-live="polite"
        >
          <p>
            Loading{' '}
            {getPeriodLabel()}{' '}
            performance...
          </p>
        </div>
      )}


      {!loading &&
        !error &&
        dashboard &&
        metrics && (
          <>
            <section
              className="dashboard-metrics"
              aria-label="Performance summary"
            >
              <article
                className="
                  dashboard-card
                  dashboard-card-primary
                  ui-card
                "
              >
                <div>
                  <span className="dashboard-card-label">
                    Net Earnings
                  </span>

                  <strong className="dashboard-primary-value">
                    {formatMoney(
                      metrics.net_income,
                    )}
                  </strong>
                </div>

                <p>
                  After fuel and other
                  recorded expenses
                </p>
              </article>


              <article className="dashboard-card ui-card">
                <span className="dashboard-card-label">
                  Gross Earnings
                </span>

                <strong>
                  {formatMoney(
                    metrics.gross_income,
                  )}
                </strong>

                <small>
                  Before expenses
                </small>
              </article>


              <article className="dashboard-card ui-card">
                <span className="dashboard-card-label">
                  Total Orders
                </span>

                <strong>
                  {metrics.total_orders}
                </strong>

                <small>
                  {
                    metrics.total_sessions
                  }{' '}
                  {
                    metrics.total_sessions ===
                    1
                      ? 'session'
                      : 'sessions'
                  }
                </small>
              </article>


              <article className="dashboard-card ui-card">
                <span className="dashboard-card-label">
                  Distance
                </span>

                <strong>
                  {formatNumber(
                    metrics.total_distance_km,
                  )}

                  {' km'}
                </strong>

                <small>
                  Total riding distance
                </small>
              </article>


              <article className="dashboard-card ui-card">
                <span className="dashboard-card-label">
                  Riding Time
                </span>

                <strong>
                  {formatHours(
                    metrics.total_hours,
                  )}
                </strong>

                <small>
                  Completed session time
                </small>
              </article>


              <article className="dashboard-card ui-card">
                <span className="dashboard-card-label">
                  RM / Hour
                </span>

                <strong>
                  {
                    metrics.income_per_hour ===
                    null
                      ? '-'
                      : formatMoney(
                          metrics.income_per_hour,
                        )
                  }
                </strong>

                <small>
                  Net earning efficiency
                </small>
              </article>


              <article className="dashboard-card ui-card">
                <span className="dashboard-card-label">
                  RM / Order
                </span>

                <strong>
                  {
                    metrics.income_per_order ===
                    null
                      ? '-'
                      : formatMoney(
                          metrics.income_per_order,
                        )
                  }
                </strong>

                <small>
                  Net income per order
                </small>
              </article>


              <article className="dashboard-card ui-card">
                <span className="dashboard-card-label">
                  RM / KM
                </span>

                <strong>
                  {
                    metrics.income_per_km ===
                    null
                      ? '-'
                      : formatMoney(
                          metrics.income_per_km,
                        )
                  }
                </strong>

                <small>
                  Net income per kilometre
                </small>
              </article>
            </section>


            <div className="dashboard-content-grid">
              <section
                className="
                  dashboard-section
                  ui-card
                "
              >
                <div className="dashboard-section-header">
                  <div>
                    <span className="ui-page-eyebrow">
                      Platform Performance
                    </span>

                    <h2>
                      {getPeriodLabel()}
                    </h2>
                  </div>
                </div>


                <div className="dashboard-platform-list">
                  {platformSummary.map(
                    (item) => (
                      <article
                        key={
                          item.platform
                        }
                        className={
                          `dashboard-platform-card ` +
                          `dashboard-platform-${item.platform}`
                        }
                      >
                        <div className="dashboard-platform-top">
                          <div>
                            <span
                              className={
                                `ui-badge ` +
                                `${getPlatformBadgeClass(
                                  item.platform,
                                )}`
                              }
                            >
                              {formatPlatform(
                                item.platform,
                              )}
                            </span>

                            <small>
                              {
                                item.total_sessions
                              }{' '}
                              {
                                item.total_sessions ===
                                1
                                  ? 'session'
                                  : 'sessions'
                              }
                            </small>
                          </div>

                          <div className="dashboard-platform-earnings">
                            <span>
                              Net Earnings
                            </span>

                            <strong>
                              {formatMoney(
                                item.net_income,
                              )}
                            </strong>
                          </div>
                        </div>


                        <div className="dashboard-platform-stats">
                          <div>
                            <span>
                              Orders
                            </span>

                            <strong>
                              {
                                item.total_orders
                              }
                            </strong>
                          </div>

                          <div>
                            <span>
                              Gross
                            </span>

                            <strong>
                              {formatMoney(
                                item.gross_income,
                              )}
                            </strong>
                          </div>

                          <div>
                            <span>
                              Net
                            </span>

                            <strong>
                              {formatMoney(
                                item.net_income,
                              )}
                            </strong>
                          </div>
                        </div>
                      </article>
                    ),
                  )}
                </div>
              </section>


              <section
                className="
                  dashboard-section
                  ui-card
                "
              >
                <div className="dashboard-section-header">
                  <div>
                    <span className="ui-page-eyebrow">
                      Recent Activity
                    </span>

                    <h2>
                      Recent Sessions
                    </h2>
                  </div>

                  <button
                    type="button"
                    className="
                      ui-button
                      ui-button-ghost
                      ui-button-sm
                    "
                    onClick={() =>
                      navigate(
                        '/sessions',
                      )
                    }
                  >
                    View All →
                  </button>
                </div>


                {recentSessions.length ===
                0 ? (
                  <div className="dashboard-empty">
                    <p>
                      No completed
                      sessions yet.
                    </p>

                    <button
                      type="button"
                      className="
                        ui-button
                        ui-button-secondary
                        ui-button-sm
                      "
                      onClick={() =>
                        navigate(
                          '/session/start',
                        )
                      }
                    >
                      Start your first
                      session
                    </button>
                  </div>
                ) : (
                  <div className="dashboard-recent-list">
                    {recentSessions.map(
                      (session) => (
                        <button
                          key={
                            session.id
                          }
                          type="button"
                          className="dashboard-recent-item"
                          onClick={() =>
                            navigate(
                              `/sessions/${session.id}`,
                            )
                          }
                        >
                          <div className="dashboard-recent-main">
                            <span
                              className={
                                `ui-badge ` +
                                `${getPlatformBadgeClass(
                                  session.platform,
                                )}`
                              }
                            >
                              {formatPlatform(
                                session.platform,
                              )}
                            </span>

                            <span className="dashboard-recent-date">
                              {formatDate(
                                session.session_date,
                              )}
                            </span>
                          </div>


                          <div className="dashboard-recent-stats">
                            <span>
                              {
                                session.total_orders
                              }{' '}
                              {
                                session.total_orders ===
                                1
                                  ? 'order'
                                  : 'orders'
                              }
                            </span>

                            <strong>
                              {formatMoney(
                                session.net_income,
                              )}
                            </strong>
                          </div>

                          <span
                            className="dashboard-recent-arrow"
                            aria-hidden="true"
                          >
                            →
                          </span>
                        </button>
                      ),
                    )}
                  </div>
                )}
              </section>
            </div>
          </>
        )}
    </main>
  )
}


export default Dashboard