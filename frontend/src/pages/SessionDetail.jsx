import {
  useEffect,
  useState,
} from 'react'

import {
  useNavigate,
  useParams,
} from 'react-router-dom'

import {
  deleteRiderSession,
  getSessionDetail,
  updateRiderSession,
} from '../services/sessionService'

import '../styles/sessionDetail.css'


const platformLabels = {
  shopeefood: 'ShopeeFood',
  grabfood: 'GrabFood',
  lalamove: 'Lalamove',
}


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

  const [
    isEditing,
    setIsEditing,
  ] = useState(false)

  const [
    saving,
    setSaving,
  ] = useState(false)

  const [
    editError,
    setEditError,
  ] = useState('')

  const [
    deleting,
    setDeleting,
  ] = useState(false)

  const [
    deleteError,
    setDeleteError,
  ] = useState('')

  const [
    formData,
    setFormData,
  ] = useState({
    platform: '',
    start_mileage: '',
    end_mileage: '',
    total_orders: '',
    gross_income: '',
    fuel_cost: '',
    other_expenses: '',
    notes: '',
  })


  useEffect(() => {
    let cancelled = false

    async function loadSession() {
      try {
        const data =
          await getSessionDetail(id)

        if (!cancelled) {
          setSession(data)
          setError('')
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err.message ||
              'Unable to load session.',
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
  }, [id])


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


  function startEditing() {
    setFormData({
      platform:
        session.platform,
      start_mileage:
        session.start_mileage,
      end_mileage:
        session.end_mileage,
      total_orders:
        session.total_orders,
      gross_income:
        session.gross_income,
      fuel_cost:
        session.fuel_cost,
      other_expenses:
        session.other_expenses,
      notes:
        session.notes || '',
    })

    setEditError('')
    setDeleteError('')
    setIsEditing(true)
  }


  function cancelEditing() {
    setEditError('')
    setIsEditing(false)
  }


  function handleChange(event) {
    const {
      name,
      value,
    } = event.target

    setFormData(
      (current) => ({
        ...current,
        [name]: value,
      }),
    )
  }


  async function handleSubmit(event) {
    event.preventDefault()

    setEditError('')

    const startMileage = Number(
      formData.start_mileage,
    )

    const endMileage = Number(
      formData.end_mileage,
    )

    const totalOrders = Number(
      formData.total_orders,
    )

    const grossIncome = Number(
      formData.gross_income,
    )

    const fuelCost = Number(
      formData.fuel_cost,
    )

    const otherExpenses = Number(
      formData.other_expenses,
    )


    if (
      !Number.isFinite(startMileage) ||
      startMileage < 0
    ) {
      setEditError(
        'Enter a valid start mileage.',
      )
      return
    }


    if (
      !Number.isFinite(endMileage) ||
      endMileage < startMileage
    ) {
      setEditError(
        'End mileage cannot be lower ' +
          'than start mileage.',
      )
      return
    }


    if (
      !Number.isInteger(totalOrders) ||
      totalOrders < 0
    ) {
      setEditError(
        'Enter a valid total order count.',
      )
      return
    }


    if (
      !Number.isFinite(grossIncome) ||
      grossIncome < 0 ||
      !Number.isFinite(fuelCost) ||
      fuelCost < 0 ||
      !Number.isFinite(otherExpenses) ||
      otherExpenses < 0
    ) {
      setEditError(
        'Income and expenses cannot ' +
          'be negative.',
      )
      return
    }


    try {
      setSaving(true)

      const updated =
        await updateRiderSession(
          id,
          {
            platform:
              formData.platform,

            start_mileage:
              formData.start_mileage,

            end_mileage:
              formData.end_mileage,

            total_orders:
              totalOrders,

            gross_income:
              formData.gross_income,

            fuel_cost:
              formData.fuel_cost,

            other_expenses:
              formData.other_expenses,

            notes:
              formData.notes,
          },
        )

      setSession(updated)
      setIsEditing(false)
    } catch (err) {
      setEditError(
        err.message ||
          'Unable to update session.',
      )
    } finally {
      setSaving(false)
    }
  }


  async function handleDelete() {
    const confirmed =
      window.confirm(
        'Delete this completed session? ' +
          'This action cannot be undone.',
      )

    if (!confirmed) {
      return
    }

    try {
      setDeleting(true)
      setDeleteError('')

      await deleteRiderSession(id)

      navigate('/sessions')
    } catch (err) {
      setDeleteError(
        err.message ||
          'Unable to delete session.',
      )
    } finally {
      setDeleting(false)
    }
  }


  if (loading) {
    return (
      <main className="detail-page">
        <div
          className="ui-state"
          aria-live="polite"
        >
          <p>
            Loading session...
          </p>
        </div>
      </main>
    )
  }


  if (error || !session) {
    return (
      <main className="detail-page">
        <button
          type="button"
          className="
            ui-button
            ui-button-secondary
            ui-button-sm
            detail-back-button
          "
          onClick={() =>
            navigate('/sessions')
          }
        >
          ← Back to Sessions
        </button>

        <div
          className="
            ui-state
            ui-state-error
          "
          role="alert"
        >
          <h2>
            Unable to Open Session
          </h2>

          <p>
            {error ||
              'Session not found.'}
          </p>
        </div>
      </main>
    )
  }


  const metrics =
    session.metrics || {}


  return (
    <main className="detail-page">
      <div className="detail-header">
        <div className="detail-header-content">
          <button
            type="button"
            className="
              ui-button
              ui-button-ghost
              ui-button-sm
              detail-back-button
            "
            onClick={() =>
              navigate('/sessions')
            }
          >
            ← Back to Sessions
          </button>

          <span className="ui-page-eyebrow">
            Session Report
          </span>

          <h1 className="ui-page-title">
            {formatPlatform(
              session.platform,
            )}{' '}
            Session
          </h1>

          <div className="detail-header-meta">
            <span>
              {formatDate(
                session.session_date,
              )}
            </span>

            <span
              className="
                ui-badge
                ui-badge-success
              "
            >
              Completed
            </span>
          </div>
        </div>

        <div className="detail-header-actions">
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

          {!isEditing && (
            <>
              <button
                type="button"
                className="
                  ui-button
                  ui-button-secondary
                "
                onClick={
                  startEditing
                }
                disabled={deleting}
              >
                Edit Session
              </button>

              <button
                type="button"
                className="
                  ui-button
                  ui-button-danger
                "
                onClick={
                  handleDelete
                }
                disabled={deleting}
              >
                {deleting
                  ? 'Deleting...'
                  : 'Delete Session'}
              </button>
            </>
          )}
        </div>
      </div>


      {deleteError && (
        <div
          className="
            ui-alert
            ui-alert-error
          "
          role="alert"
        >
          {deleteError}
        </div>
      )}


      {isEditing ? (
        <form
          className="detail-edit-form"
          onSubmit={handleSubmit}
        >
          <section
            className="
              detail-section
              ui-card
            "
          >
            <div className="detail-section-header">
              <div>
                <span className="ui-page-eyebrow">
                  Edit Session
                </span>

                <h2>
                  Session Information
                </h2>

                <p>
                  Update the original
                  session values below.
                </p>
              </div>
            </div>


            {editError && (
              <div
                className="
                  ui-alert
                  ui-alert-error
                "
                role="alert"
              >
                {editError}
              </div>
            )}


            <div className="detail-form-grid">
              <div className="ui-field">
                <label
                  className="ui-field-label"
                  htmlFor="editPlatform"
                >
                  Platform
                </label>

                <select
                  className="ui-select"
                  id="editPlatform"
                  name="platform"
                  value={
                    formData.platform
                  }
                  onChange={
                    handleChange
                  }
                  disabled={saving}
                >
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
                  htmlFor="editTotalOrders"
                >
                  Total Orders
                </label>

                <input
                  className="ui-input"
                  id="editTotalOrders"
                  type="number"
                  name="total_orders"
                  min="0"
                  step="1"
                  inputMode="numeric"
                  value={
                    formData.total_orders
                  }
                  onChange={
                    handleChange
                  }
                  disabled={saving}
                />
              </div>


              <div className="ui-field">
                <label
                  className="ui-field-label"
                  htmlFor="editStartMileage"
                >
                  Start Mileage
                </label>

                <div className="ui-input-wrapper">
                  <input
                    className="
                      ui-input
                      ui-input-has-suffix
                    "
                    id="editStartMileage"
                    type="number"
                    name="start_mileage"
                    min="0"
                    step="0.01"
                    inputMode="decimal"
                    value={
                      formData.start_mileage
                    }
                    onChange={
                      handleChange
                    }
                    disabled={saving}
                  />

                  <span className="ui-input-suffix">
                    KM
                  </span>
                </div>
              </div>


              <div className="ui-field">
                <label
                  className="ui-field-label"
                  htmlFor="editEndMileage"
                >
                  End Mileage
                </label>

                <div className="ui-input-wrapper">
                  <input
                    className="
                      ui-input
                      ui-input-has-suffix
                    "
                    id="editEndMileage"
                    type="number"
                    name="end_mileage"
                    min="0"
                    step="0.01"
                    inputMode="decimal"
                    value={
                      formData.end_mileage
                    }
                    onChange={
                      handleChange
                    }
                    disabled={saving}
                  />

                  <span className="ui-input-suffix">
                    KM
                  </span>
                </div>
              </div>


              <div className="ui-field">
                <label
                  className="ui-field-label"
                  htmlFor="editGrossIncome"
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
                    id="editGrossIncome"
                    type="number"
                    name="gross_income"
                    min="0"
                    step="0.01"
                    inputMode="decimal"
                    value={
                      formData.gross_income
                    }
                    onChange={
                      handleChange
                    }
                    disabled={saving}
                  />
                </div>
              </div>


              <div className="ui-field">
                <label
                  className="ui-field-label"
                  htmlFor="editFuelCost"
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
                    id="editFuelCost"
                    type="number"
                    name="fuel_cost"
                    min="0"
                    step="0.01"
                    inputMode="decimal"
                    value={
                      formData.fuel_cost
                    }
                    onChange={
                      handleChange
                    }
                    disabled={saving}
                  />
                </div>
              </div>


              <div className="ui-field">
                <label
                  className="ui-field-label"
                  htmlFor="editOtherExpenses"
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
                    id="editOtherExpenses"
                    type="number"
                    name="other_expenses"
                    min="0"
                    step="0.01"
                    inputMode="decimal"
                    value={
                      formData.other_expenses
                    }
                    onChange={
                      handleChange
                    }
                    disabled={saving}
                  />
                </div>
              </div>


              <div
                className="
                  ui-field
                  detail-form-notes
                "
              >
                <label
                  className="ui-field-label"
                  htmlFor="editNotes"
                >
                  Notes

                  <span className="ui-field-hint">
                    {' '}
                    (Optional)
                  </span>
                </label>

                <textarea
                  className="ui-textarea"
                  id="editNotes"
                  name="notes"
                  rows="4"
                  maxLength="2000"
                  value={
                    formData.notes
                  }
                  onChange={
                    handleChange
                  }
                  disabled={saving}
                />
              </div>
            </div>


            <div className="detail-form-actions">
              <button
                type="button"
                className="
                  ui-button
                  ui-button-secondary
                "
                onClick={
                  cancelEditing
                }
                disabled={saving}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="
                  ui-button
                  ui-button-primary
                "
                disabled={saving}
              >
                {saving
                  ? 'Saving...'
                  : 'Save Changes'}
              </button>
            </div>
          </section>
        </form>
      ) : (
        <>
          <section className="detail-metrics-grid">
            <article
              className="
                detail-metric-card
                detail-metric-primary
                ui-card
              "
            >
              <span>
                Net Income
              </span>

              <strong>
                {formatMoney(
                  metrics.net_income,
                )}
              </strong>

              <small>
                After all expenses
              </small>
            </article>

            <article
              className="
                detail-metric-card
                ui-card
              "
            >
              <span>
                Distance
              </span>

              <strong>
                {formatNumber(
                  metrics.distance_km,
                  ' km',
                )}
              </strong>

              <small>
                Total ride distance
              </small>
            </article>

            <article
              className="
                detail-metric-card
                ui-card
              "
            >
              <span>
                Duration
              </span>

              <strong>
                {formatDuration(
                  metrics.duration_minutes,
                )}
              </strong>

              <small>
                Session duration
              </small>
            </article>

            <article
              className="
                detail-metric-card
                ui-card
              "
            >
              <span>
                Orders
              </span>

              <strong>
                {session.total_orders}
              </strong>

              <small>
                Completed deliveries
              </small>
            </article>
          </section>


          <div className="detail-report-grid">
            <section
              className="
                detail-section
                ui-card
              "
            >
              <div className="detail-section-header">
                <div>
                  <span className="ui-page-eyebrow">
                    Performance
                  </span>

                  <h2>
                    Earnings Efficiency
                  </h2>
                </div>
              </div>

              <div className="detail-info-grid detail-info-grid-3">
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


            <section
              className="
                detail-section
                ui-card
              "
            >
              <div className="detail-section-header">
                <div>
                  <span className="ui-page-eyebrow">
                    Financial
                  </span>

                  <h2>
                    Earnings & Expenses
                  </h2>
                </div>
              </div>

              <div className="detail-financial-list">
                <div>
                  <span>
                    Gross Income
                  </span>

                  <strong>
                    {formatMoney(
                      session.gross_income,
                    )}
                  </strong>
                </div>

                <div>
                  <span>
                    Fuel Cost
                  </span>

                  <strong className="detail-negative">
                    -
                    {formatMoney(
                      session.fuel_cost,
                    )}
                  </strong>
                </div>

                <div>
                  <span>
                    Other Expenses
                  </span>

                  <strong className="detail-negative">
                    -
                    {formatMoney(
                      session.other_expenses,
                    )}
                  </strong>
                </div>

                <div className="detail-financial-net">
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
          </div>


          <section
            className="
              detail-section
              ui-card
            "
          >
            <div className="detail-section-header">
              <div>
                <span className="ui-page-eyebrow">
                  Ride Information
                </span>

                <h2>
                  Session Details
                </h2>
              </div>
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


          <section
            className="
              detail-section
              ui-card
            "
          >
            <div className="detail-section-header">
              <div>
                <span className="ui-page-eyebrow">
                  Notes
                </span>

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
        </>
      )}
    </main>
  )
}


export default SessionDetail