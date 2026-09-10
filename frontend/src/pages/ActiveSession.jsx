import {
  useEffect,
  useMemo,
  useState,
} from 'react'

import {
  useNavigate,
} from 'react-router-dom'

import {
  endRiderSession,
  getActiveSession,
} from '../services/sessionService'


const platformLabels = {
  shopeefood: 'ShopeeFood',
  grabfood: 'GrabFood',
  lalamove: 'Lalamove',
}


function formatDateTime(value) {
  if (!value) {
    return '-'
  }

  return new Date(
    value,
  ).toLocaleString()
}


function formatDuration(
  startTime,
  currentTime,
) {
  if (!startTime) {
    return '0m'
  }

  const start = new Date(
    startTime,
  )

  const difference =
    currentTime.getTime()
    - start.getTime()

  const totalMinutes =
    Math.max(
      0,
      Math.floor(
        difference / 60000,
      ),
    )

  const hours = Math.floor(
    totalMinutes / 60,
  )

  const minutes =
    totalMinutes % 60

  if (hours <= 0) {
    return `${minutes}m`
  }

  return `${hours}h ${minutes}m`
}


function ActiveSession() {
  const navigate = useNavigate()

  const [
    riderSession,
    setRiderSession,
  ] = useState(null)

  const [
    loading,
    setLoading,
  ] = useState(true)

  const [
    submitting,
    setSubmitting,
  ] = useState(false)

  const [error, setError] =
    useState('')

  const [
    currentTime,
    setCurrentTime,
  ] = useState(
    new Date(),
  )

  const [
    endMileage,
    setEndMileage,
  ] = useState('')

  const [
    totalOrders,
    setTotalOrders,
  ] = useState('')

  const [
    grossIncome,
    setGrossIncome,
  ] = useState('')

  const [
    fuelCost,
    setFuelCost,
  ] = useState('')

  const [
    otherExpenses,
    setOtherExpenses,
  ] = useState('')

  const [notes, setNotes] =
    useState('')


  useEffect(() => {
    let cancelled = false

    async function loadSession() {
      try {
        const data =
          await getActiveSession()

        if (!cancelled) {
          setRiderSession(data)

          setNotes(
            data.notes || '',
          )
        }
      } catch (requestError) {
        if (
          requestError.message ===
          'No active rider session found.'
        ) {
          navigate(
            '/session/start',
            {
              replace: true,
            },
          )

          return
        }

        if (!cancelled) {
          setError(
            requestError.message,
          )
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    loadSession()

    return () => {
      cancelled = true
    }
  }, [navigate])


  useEffect(() => {
    const interval =
      window.setInterval(
        () => {
          setCurrentTime(
            new Date(),
          )
        },
        30000,
      )

    return () => {
      window.clearInterval(
        interval,
      )
    }
  }, [])


  const duration = useMemo(
    () =>
      formatDuration(
        riderSession?.start_time,
        currentTime,
      ),
    [
      riderSession?.start_time,
      currentTime,
    ],
  )


  async function handleEndSession(
    event,
  ) {
    event.preventDefault()

    if (!riderSession) {
      return
    }

    setError('')

    if (!endMileage) {
      setError(
        'Ending mileage is required.',
      )
      return
    }

    if (!totalOrders) {
      setError(
        'Total orders is required.',
      )
      return
    }

    if (!grossIncome) {
      setError(
        'Gross income is required.',
      )
      return
    }

    const endingMileage =
      Number(endMileage)

    const startingMileage =
      Number(
        riderSession.start_mileage,
      )

    if (
      Number.isNaN(
        endingMileage,
      ) ||
      endingMileage <
        startingMileage
    ) {
      setError(
        'Ending mileage cannot be lower than starting mileage.',
      )
      return
    }

    const orderCount =
      Number(totalOrders)

    if (
      !Number.isInteger(
        orderCount,
      ) ||
      orderCount < 0
    ) {
      setError(
        'Total orders must be a valid whole number.',
      )
      return
    }

    try {
      setSubmitting(true)

      const result =
        await endRiderSession(
          riderSession.id,
          {
            end_mileage:
              endMileage,

            total_orders:
              orderCount,

            gross_income:
              grossIncome,

            fuel_cost:
              fuelCost || '0.00',

            other_expenses:
              otherExpenses ||
              '0.00',

            notes:
              notes.trim()
              || null,
          },
        )

      navigate(
        `/sessions/${result.id}`,
        {
          replace: true,
        },
      )
    } catch (requestError) {
      setError(
        requestError.message,
      )
    } finally {
      setSubmitting(false)
    }
  }


  if (loading) {
    return (
      <section className="session-page">
        <div
          className="ui-state session-state"
          aria-live="polite"
        >
          <p>
            Loading active session...
          </p>
        </div>
      </section>
    )
  }


  if (!riderSession) {
    return (
      <section className="session-page">
        <div className="ui-state session-state">
          <h2>No Active Ride</h2>

          <p>
            There is currently no
            active rider session.
          </p>
        </div>
      </section>
    )
  }


  return (
    <section className="session-page">
      <div className="session-card ui-card">
        <div className="session-card-header">
          <div>
            <span className="ui-page-eyebrow">
              Active Ride
            </span>

            <h1 className="session-title">
              {
                platformLabels[
                  riderSession
                    .platform
                ] ||
                riderSession
                  .platform
              }
            </h1>

            <p className="session-description">
              Your rider session is
              currently active.
            </p>
          </div>

          <span
            className="
              ui-badge
              ui-badge-success
            "
          >
            <span
              className="
                ui-status-dot
                ui-status-dot-success
              "
              aria-hidden="true"
            />

            Active
          </span>
        </div>

        <div className="active-session-summary">
          <div>
            <span>
              Start Time
            </span>

            <strong>
              {formatDateTime(
                riderSession
                  .start_time,
              )}
            </strong>
          </div>

          <div>
            <span>
              Start Mileage
            </span>

            <strong>
              {
                riderSession
                  .start_mileage
              }{' '}
              KM
            </strong>
          </div>

          <div>
            <span>
              Duration
            </span>

            <strong>
              {duration}
            </strong>
          </div>
        </div>

        <form
          className="session-form"
          onSubmit={
            handleEndSession
          }
        >
          <div className="session-section-heading">
            <h2>
              End Ride
            </h2>

            <p>
              Enter your final rider
              session information.
            </p>
          </div>

          <div className="ui-field">
            <label
              className="ui-field-label"
              htmlFor="endMileage"
            >
              Ending Mileage
            </label>

            <div className="ui-input-wrapper">
              <input
                className="
                  ui-input
                  ui-input-has-suffix
                "
                id="endMileage"
                type="number"
                min={
                  riderSession
                    .start_mileage
                }
                step="0.01"
                inputMode="decimal"
                placeholder="e.g. 5262"
                value={
                  endMileage
                }
                onChange={(
                  event,
                ) =>
                  setEndMileage(
                    event
                      .target
                      .value,
                  )
                }
                disabled={
                  submitting
                }
              />

              <span className="ui-input-suffix">
                KM
              </span>
            </div>
          </div>

          <div className="session-form-grid">
            <div className="ui-field">
              <label
                className="ui-field-label"
                htmlFor="totalOrders"
              >
                Total Orders
              </label>

              <input
                className="ui-input"
                id="totalOrders"
                type="number"
                min="0"
                step="1"
                inputMode="numeric"
                placeholder="0"
                value={
                  totalOrders
                }
                onChange={(
                  event,
                ) =>
                  setTotalOrders(
                    event
                      .target
                      .value,
                  )
                }
                disabled={
                  submitting
                }
              />
            </div>

            <div className="ui-field">
              <label
                className="ui-field-label"
                htmlFor="grossIncome"
              >
                Gross Income
              </label>

              <div className="ui-input-wrapper">
                <span className="ui-input-prefix">
                  RM
                </span>

                <input
                  className="
                    ui-input
                    ui-input-has-prefix
                  "
                  id="grossIncome"
                  type="number"
                  min="0"
                  step="0.01"
                  inputMode="decimal"
                  placeholder="0.00"
                  value={
                    grossIncome
                  }
                  onChange={(
                    event,
                  ) =>
                    setGrossIncome(
                      event
                        .target
                        .value,
                    )
                  }
                  disabled={
                    submitting
                  }
                />
              </div>
            </div>

            <div className="ui-field">
              <label
                className="ui-field-label"
                htmlFor="fuelCost"
              >
                Fuel Cost
              </label>

              <div className="ui-input-wrapper">
                <span className="ui-input-prefix">
                  RM
                </span>

                <input
                  className="
                    ui-input
                    ui-input-has-prefix
                  "
                  id="fuelCost"
                  type="number"
                  min="0"
                  step="0.01"
                  inputMode="decimal"
                  placeholder="0.00"
                  value={
                    fuelCost
                  }
                  onChange={(
                    event,
                  ) =>
                    setFuelCost(
                      event
                        .target
                        .value,
                    )
                  }
                  disabled={
                    submitting
                  }
                />
              </div>
            </div>

            <div className="ui-field">
              <label
                className="ui-field-label"
                htmlFor="otherExpenses"
              >
                Other Expenses
              </label>

              <div className="ui-input-wrapper">
                <span className="ui-input-prefix">
                  RM
                </span>

                <input
                  className="
                    ui-input
                    ui-input-has-prefix
                  "
                  id="otherExpenses"
                  type="number"
                  min="0"
                  step="0.01"
                  inputMode="decimal"
                  placeholder="0.00"
                  value={
                    otherExpenses
                  }
                  onChange={(
                    event,
                  ) =>
                    setOtherExpenses(
                      event
                        .target
                        .value,
                    )
                  }
                  disabled={
                    submitting
                  }
                />
              </div>
            </div>
          </div>

          <div className="ui-field">
            <label
              className="ui-field-label"
              htmlFor="endNotes"
            >
              Notes

              <span className="ui-field-hint">
                {' '}
                (Optional)
              </span>
            </label>

            <textarea
              className="ui-textarea"
              id="endNotes"
              rows="4"
              maxLength="2000"
              placeholder="Anything useful about this session..."
              value={notes}
              onChange={(
                event,
              ) =>
                setNotes(
                  event
                    .target
                    .value,
                )
              }
              disabled={
                submitting
              }
            />
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

          <button
            className="
              ui-button
              ui-button-danger
              ui-button-block
            "
            type="submit"
            disabled={
              submitting
            }
          >
            {submitting
              ? 'Ending Ride...'
              : 'End Ride'}
          </button>
        </form>
      </div>
    </section>
  )
}


export default ActiveSession