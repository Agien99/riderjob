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


const platformLabels = {
  shopeefood: 'ShopeeFood',
  grabfood: 'GrabFood',
  lalamove: 'Lalamove',
}


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
    let cancelled = false

    async function loadHistory() {
      try {
        const data =
          await getSessionHistory()

        if (!cancelled) {
          setSessions(data)
          setError('')
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err.message ||
              'Unable to load session history.',
          )
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    loadHistory()

    return () => {
      cancelled = true
    }
  }, [])


  const filteredSessions =
    useMemo(() => {
      const normalizedSearch =
        search
          .trim()
          .toLowerCase()

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
    return (
      platformLabels[platform] ||
      platform
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
        <div
          className="ui-state"
          aria-live="polite"
        >
          <p>
            Loading session history...
          </p>
        </div>
      </main>
    )
  }


  return (
    <main className="history-page">
      <div className="ui-page-header">
        <div className="ui-page-header-content">
          <span className="ui-page-eyebrow">
            Rider Activity
          </span>

          <h1 className="ui-page-title">
            Session History
          </h1>

          <p className="ui-page-subtitle">
            Review your completed
            rider sessions.
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


      {!error &&
        sessions.length === 0 && (
          <div className="ui-state">
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
              Start Session
            </button>
          </div>
        )}


      {!error &&
        sessions.length > 0 && (
          <>
            <section
              className="
                history-filters
                ui-card
              "
            >
              <div className="history-filter-header">
                <div>
                  <span className="ui-page-eyebrow">
                    Filter Records
                  </span>

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
                <div className="ui-field">
                  <label
                    className="ui-field-label"
                    htmlFor="historyPlatform"
                  >
                    Platform
                  </label>

                  <select
                    className="ui-select"
                    id="historyPlatform"
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
                </div>

                <div className="ui-field">
                  <label
                    className="ui-field-label"
                    htmlFor="historyFromDate"
                  >
                    From Date
                  </label>

                  <input
                    className="
                      ui-input
                      history-date-input
                    "
                    id="historyFromDate"
                    type="date"
                    value={fromDate}
                    max={
                      toDate ||
                      undefined
                    }
                    onChange={(event) =>
                      setFromDate(
                        event.target.value,
                      )
                    }
                  />
                </div>

                <div className="ui-field">
                  <label
                    className="ui-field-label"
                    htmlFor="historyToDate"
                  >
                    To Date
                  </label>

                  <input
                    className="
                      ui-input
                      history-date-input
                    "
                    id="historyToDate"
                    type="date"
                    value={toDate}
                    min={
                      fromDate ||
                      undefined
                    }
                    onChange={(event) =>
                      setToDate(
                        event.target.value,
                      )
                    }
                  />
                </div>

                <div className="ui-field">
                  <label
                    className="ui-field-label"
                    htmlFor="historySearch"
                  >
                    Search Notes
                  </label>

                  <input
                    className="ui-input"
                    id="historySearch"
                    type="search"
                    placeholder="e.g. morning, rain..."
                    value={search}
                    onChange={(event) =>
                      setSearch(
                        event.target.value,
                      )
                    }
                  />
                </div>
              </div>

              {hasFilters && (
                <div className="history-filter-actions">
                  <button
                    type="button"
                    className="
                      ui-button
                      ui-button-secondary
                      ui-button-sm
                    "
                    onClick={
                      clearFilters
                    }
                  >
                    Clear Filters
                  </button>
                </div>
              )}
            </section>


            {filteredSessions.length ===
            0 ? (
              <div className="ui-state">
                <h2>
                  No matching sessions
                </h2>

                <p>
                  Try changing or
                  clearing your current
                  filters.
                </p>

                <button
                  type="button"
                  className="
                    ui-button
                    ui-button-secondary
                  "
                  onClick={
                    clearFilters
                  }
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <div
                className="
                  history-table-card
                  ui-card
                "
              >
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
                        <th>
                          <span className="sr-only">
                            Actions
                          </span>
                        </th>
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
                                session
                                  .session_date,
                              )}
                            </td>

                            <td>
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
                            </td>

                            <td>
                              {formatTime(
                                session
                                  .start_time,
                              )}
                              {' – '}
                              {formatTime(
                                session
                                  .end_time,
                              )}
                            </td>

                            <td>
                              {
                                session
                                  .total_orders
                              }
                            </td>

                            <td>
                              {formatMoney(
                                session
                                  .gross_income,
                              )}
                            </td>

                            <td>
                              {formatMoney(
                                session
                                  .fuel_cost,
                              )}
                            </td>

                            <td>
                              <span
                                className="
                                  ui-badge
                                  ui-badge-success
                                "
                              >
                                Completed
                              </span>
                            </td>

                            <td>
                              <button
                                type="button"
                                className="
                                  ui-button
                                  ui-button-secondary
                                  ui-button-sm
                                "
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