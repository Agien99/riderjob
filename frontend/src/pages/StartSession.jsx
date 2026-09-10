import {
  useEffect,
  useState,
} from 'react'

import {
  useNavigate,
} from 'react-router-dom'

import {
  getActiveSession,
  startRiderSession,
} from '../services/sessionService'


const platforms = [
  {
    value: 'shopeefood',
    label: 'ShopeeFood',
  },
  {
    value: 'grabfood',
    label: 'GrabFood',
  },
  {
    value: 'lalamove',
    label: 'Lalamove',
  },
]


function StartSession() {
  const navigate = useNavigate()

  const [platform, setPlatform] =
    useState('shopeefood')

  const [
    startMileage,
    setStartMileage,
  ] = useState('')

  const [notes, setNotes] =
    useState('')

  const [loading, setLoading] =
    useState(false)

  const [
    checkingActiveSession,
    setCheckingActiveSession,
  ] = useState(true)

  const [error, setError] =
    useState('')


  useEffect(() => {
    let cancelled = false

    async function checkActiveSession() {
      try {
        await getActiveSession()

        if (!cancelled) {
          navigate(
            '/session/active',
            {
              replace: true,
            },
          )
        }
      } catch (requestError) {
        if (
          !cancelled &&
          requestError.message !==
            'No active rider session found.'
        ) {
          setError(
            requestError.message,
          )
        }
      } finally {
        if (!cancelled) {
          setCheckingActiveSession(
            false,
          )
        }
      }
    }

    checkActiveSession()

    return () => {
      cancelled = true
    }
  }, [navigate])


  async function handleSubmit(event) {
    event.preventDefault()

    setError('')

    if (!startMileage) {
      setError(
        'Starting mileage is required.',
      )
      return
    }

    const mileage = Number(
      startMileage,
    )

    if (
      Number.isNaN(mileage) ||
      mileage < 0
    ) {
      setError(
        'Starting mileage must be a valid positive number.',
      )
      return
    }

    try {
      setLoading(true)

      await startRiderSession({
        platform,
        start_mileage:
          startMileage,
        notes:
          notes.trim() || null,
      })

      navigate(
        '/session/active',
        {
          replace: true,
        },
      )
    } catch (requestError) {
      setError(
        requestError.message,
      )
    } finally {
      setLoading(false)
    }
  }


  if (checkingActiveSession) {
    return (
      <section className="session-page">
        <div
          className="ui-state session-state"
          aria-live="polite"
        >
          <p>
            Checking active session...
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
              New Ride
            </span>

            <h1 className="session-title">
              Start Rider Session
            </h1>

            <p className="session-description">
              Select your platform and
              enter your current
              motorcycle mileage.
            </p>
          </div>
        </div>

        <form
          className="session-form"
          onSubmit={handleSubmit}
        >
          <fieldset className="platform-fieldset">
            <legend className="ui-field-label">
              Delivery Platform
            </legend>

            <div className="platform-options">
              {platforms.map(
                (item) => (
                  <label
                    className={
                      platform ===
                      item.value
                        ? `platform-option
                          platform-option-selected
                          platform-${item.value}`
                        : `platform-option
                          platform-${item.value}`
                    }
                    key={item.value}
                  >
                    <input
                      type="radio"
                      name="platform"
                      value={
                        item.value
                      }
                      checked={
                        platform ===
                        item.value
                      }
                      onChange={(
                        event,
                      ) =>
                        setPlatform(
                          event
                            .target
                            .value,
                        )
                      }
                      disabled={loading}
                    />

                    <span>
                      {item.label}
                    </span>
                  </label>
                ),
              )}
            </div>
          </fieldset>

          <div className="ui-field">
            <label
              className="ui-field-label"
              htmlFor="startMileage"
            >
              Starting Mileage
            </label>

            <div className="ui-input-wrapper">
              <input
                className="
                  ui-input
                  ui-input-has-suffix
                "
                id="startMileage"
                type="number"
                min="0"
                step="0.01"
                inputMode="decimal"
                placeholder="e.g. 5234"
                value={
                  startMileage
                }
                onChange={(
                  event,
                ) =>
                  setStartMileage(
                    event.target.value,
                  )
                }
                disabled={loading}
              />

              <span className="ui-input-suffix">
                KM
              </span>
            </div>
          </div>

          <div className="ui-field">
            <label
              className="ui-field-label"
              htmlFor="notes"
            >
              Notes

              <span className="ui-field-hint">
                {' '}
                (Optional)
              </span>
            </label>

            <textarea
              className="ui-textarea"
              id="notes"
              rows="4"
              maxLength="2000"
              placeholder="Anything useful about this session..."
              value={notes}
              onChange={(
                event,
              ) =>
                setNotes(
                  event.target.value,
                )
              }
              disabled={loading}
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
              ui-button-primary
              ui-button-block
            "
            type="submit"
            disabled={loading}
          >
            {loading
              ? 'Starting Ride...'
              : 'Start Ride'}
          </button>
        </form>
      </div>
    </section>
  )
}


export default StartSession