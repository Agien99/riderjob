import {
  useEffect,
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
                  {sessions.map(
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
    </main>
  )
}

export default SessionHistory