import {
  useEffect,
  useMemo,
  useState,
} from 'react'
import {
  useNavigate,
} from 'react-router-dom'

import {
  getSessionHistory,
} from '../services/sessionService'

import '../styles/sessionHistory.css'


function SessionHistory() {
  const navigate = useNavigate()

  const [
    sessions,
    setSessions,
  ] = useState([])

  const [
    loading,
    setLoading,
  ] = useState(true)

  const [
    error,
    setError,
  ] = useState('')

  const [
    platformFilter,
    setPlatformFilter,
  ] = useState('all')

  const [
    fromDate,
    setFromDate,
  ] = useState('')

  const [
    toDate,
    setToDate,
  ] = useState('')

  const [
    search,
    setSearch,
  ] = useState('')

  useEffect(() => {
    async function loadHistory() {
      try {
        setLoading(true)
        setError('')

        const data =
          await getSessionHistory()

        setSessions(data)
      } catch (err) {
        setError(
          err.message ||
            'Unable to load session history.',
        )
      } finally {
        setLoading(false)
      }
    }

    loadHistory()
  }, [])

  const filteredSessions =
    useMemo(() => {
      const normalizedSearch =
        search.trim().toLowerCase()

      return sessions.filter(
        (session) => {
          if (
            platformFilter !== 'all' &&
            session.platform !==
              platformFilter
          ) {
            return false
          }

          if (
            fromDate &&
            session.session_date <
              fromDate
          ) {
            return false
          }

          if (
            toDate &&
            session.session_date >
              toDate
          ) {
            return false
          }

          if (normalizedSearch) {
            const notes = (
              session.notes || ''
            ).toLowerCase()

            if (
              !notes.includes(
                normalizedSearch,
              )
            ) {
              return false
            }
          }

          return true
        },
      )
    }, [
      sessions,
      platformFilter,
      fromDate,
      toDate,
      search,
    ])

  const hasFilters =
    platformFilter !== 'all' ||
    fromDate !== '' ||
    toDate !== '' ||
    search.trim() !== ''

  function clearFilters() {
    setPlatformFilter('all')
    setFromDate('')
    setToDate('')
    setSearch('')
  }

  function formatPlatform(platform) {
    const labels = {
      shopeefood: 'ShopeeFood',
      grabfood: 'GrabFood',
      lalamove: 'Lalamove',
    }

    return (
      labels[platform] ||
      platform
    )
  }

  function formatDate(date) {
    if (!date) {
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
        `${date}T00:00:00`,
      ),
    )
  }

  function formatTime(value) {
    if (!value) {
      return '-'
    }

    return new Intl.DateTimeFormat(
      'en-MY',
      {
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

  if (loading) {
    return (
      <main className="history-page">
        <div className="history-header">
          <div>
            <p className="history-eyebrow">
              RIDER ACTIVITY
            </p>

            <h1>
              Session History
            </h1>

            <p>
              Review your completed
              rider sessions.
            </p>
          </div>
        </div>

        <div className="history-state">
          Loading session history...
        </div>
      </main>
    )
  }

  return (
    <main className="history-page">
      <div className="history-header">
        <div>
          <p className="history-eyebrow">
            RIDER ACTIVITY
          </p>

          <h1>
            Session History
          </h1>

          <p>
            Review your completed
            rider sessions.
          </p>
        </div>

        <button
          type="button"
          className="history-start-button"
          onClick={() =>
            navigate('/session/start')
          }
        >
          + Start Session
        </button>
      </div>

      {error && (
        <div className="history-error">
          {error}
        </div>
      )}

      {!error &&
        sessions.length === 0 && (
          <div className="history-empty">
            <h2>
              No completed sessions yet
            </h2>

            <p>
              Complete your first rider
              session and it will appear
              here.
            </p>

            <button
              type="button"
              onClick={() =>
                navigate(
                  '/session/start',
                )
              }
            >
              Start Session
            </button>
          </div>
        )}

      {!error &&
        sessions.length > 0 && (
          <>
            <section className="history-filters">
              <div className="history-filter-header">
                <div>
                  <p className="history-eyebrow">
                    FILTER RECORDS
                  </p>

                  <h2>
                    Find a Session
                  </h2>
                </div>

                <span className="history-result-count">
                  {filteredSessions.length}
                  {' '}
                  {filteredSessions.length === 1
                    ? 'session'
                    : 'sessions'}
                </span>
              </div>

              <div className="history-filter-grid">
                <label className="history-filter-field">
                  <span>
                    Platform
                  </span>

                  <select
                    value={platformFilter}
                    onChange={(event) =>
                      setPlatformFilter(
                        event.target.value,
                      )
                    }
                  >
                    <option value="all">
                      All Platforms
                    </option>

                    <option value="shopeefood">
                      ShopeeFood
                    </option>

                    <option value="grabfood">
                      GrabFood
                    </option>

                    <option value="lalamove">
                      Lalamove
                    </option>
                  </select>
                </label>

                <label className="history-filter-field">
                  <span>
                    From Date
                  </span>

                  <input
                    type="date"
                    value={fromDate}
                    max={toDate || undefined}
                    onChange={(event) =>
                      setFromDate(
                        event.target.value,
                      )
                    }
                  />
                </label>

                <label className="history-filter-field">
                  <span>
                    To Date
                  </span>

                  <input
                    type="date"
                    value={toDate}
                    min={fromDate || undefined}
                    onChange={(event) =>
                      setToDate(
                        event.target.value,
                      )
                    }
                  />
                </label>

                <label className="history-filter-field">
                  <span>
                    Search Notes
                  </span>

                  <input
                    type="search"
                    placeholder="e.g. morning, rain..."
                    value={search}
                    onChange={(event) =>
                      setSearch(
                        event.target.value,
                      )
                    }
                  />
                </label>
              </div>

              {hasFilters && (
                <div className="history-filter-actions">
                  <button
                    type="button"
                    className="history-clear-button"
                    onClick={clearFilters}
                  >
                    Clear Filters
                  </button>
                </div>
              )}
            </section>

            {filteredSessions.length ===
            0 ? (
              <div className="history-no-results">
                <h2>
                  No matching sessions
                </h2>

                <p>
                  Try changing or clearing
                  your current filters.
                </p>

                <button
                  type="button"
                  onClick={clearFilters}
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="history-table-card">
                <div className="history-table-wrapper">
                  <table className="history-table">
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Platform</th>
                        <th>Time</th>
                        <th>Orders</th>
                        <th>Gross</th>
                        <th>Fuel</th>
                        <th>Status</th>
                        <th />
                      </tr>
                    </thead>

                    <tbody>
                      {filteredSessions.map(
                        (session) => (
                          <tr
                            key={
                              session.id
                            }
                          >
                            <td>
                              {formatDate(
                                session.session_date,
                              )}
                            </td>

                            <td>
                              <span
                                className={
                                  `platform-badge ` +
                                  `platform-${session.platform}`
                                }
                              >
                                {formatPlatform(
                                  session.platform,
                                )}
                              </span>
                            </td>

                            <td>
                              {formatTime(
                                session.start_time,
                              )}
                              {' – '}
                              {formatTime(
                                session.end_time,
                              )}
                            </td>

                            <td>
                              {
                                session.total_orders
                              }
                            </td>

                            <td>
                              {formatMoney(
                                session.gross_income,
                              )}
                            </td>

                            <td>
                              {formatMoney(
                                session.fuel_cost,
                              )}
                            </td>

                            <td>
                              <span className="completed-badge">
                                Completed
                              </span>
                            </td>

                            <td>
                              <button
                                type="button"
                                className="history-view-button"
                                onClick={() =>
                                  navigate(
                                    `/sessions/${session.id}`,
                                  )
                                }
                              >
                                View
                              </button>
                            </td>
                          </tr>
                        ),
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}
    </main>
  )
}

export default SessionHistory