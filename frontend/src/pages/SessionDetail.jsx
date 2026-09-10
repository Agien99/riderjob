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
  updateRiderSession,
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

        <div className="detail-header-actions">
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

          {!isEditing && (
            <button
              type="button"
              className="detail-edit-button"
              onClick={startEditing}
            >
              Edit Session
            </button>
          )}
        </div>
      </div>

      {isEditing ? (
        <form
          className="detail-edit-form"
          onSubmit={handleSubmit}
        >
          <section className="detail-section">
            <div className="detail-section-header">
              <div>
                <p className="detail-eyebrow">
                  EDIT SESSION
                </p>

                <h2>
                  Session Information
                </h2>
              </div>
            </div>

            {editError && (
              <div className="detail-edit-error">
                {editError}
              </div>
            )}

            <div className="detail-form-grid">
              <label className="detail-form-field">
                <span>
                  Platform
                </span>

                <select
                  name="platform"
                  value={
                    formData.platform
                  }
                  onChange={handleChange}
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
              </label>

              <label className="detail-form-field">
                <span>
                  Total Orders
                </span>

                <input
                  type="number"
                  name="total_orders"
                  min="0"
                  step="1"
                  value={
                    formData.total_orders
                  }
                  onChange={handleChange}
                />
              </label>

              <label className="detail-form-field">
                <span>
                  Start Mileage
                </span>

                <input
                  type="number"
                  name="start_mileage"
                  min="0"
                  step="0.01"
                  value={
                    formData.start_mileage
                  }
                  onChange={handleChange}
                />
              </label>

              <label className="detail-form-field">
                <span>
                  End Mileage
                </span>

                <input
                  type="number"
                  name="end_mileage"
                  min="0"
                  step="0.01"
                  value={
                    formData.end_mileage
                  }
                  onChange={handleChange}
                />
              </label>

              <label className="detail-form-field">
                <span>
                  Gross Income (RM)
                </span>

                <input
                  type="number"
                  name="gross_income"
                  min="0"
                  step="0.01"
                  value={
                    formData.gross_income
                  }
                  onChange={handleChange}
                />
              </label>

              <label className="detail-form-field">
                <span>
                  Fuel Cost (RM)
                </span>

                <input
                  type="number"
                  name="fuel_cost"
                  min="0"
                  step="0.01"
                  value={
                    formData.fuel_cost
                  }
                  onChange={handleChange}
                />
              </label>

              <label className="detail-form-field">
                <span>
                  Other Expenses (RM)
                </span>

                <input
                  type="number"
                  name="other_expenses"
                  min="0"
                  step="0.01"
                  value={
                    formData.other_expenses
                  }
                  onChange={handleChange}
                />
              </label>

              <label className="detail-form-field detail-form-notes">
                <span>
                  Notes
                </span>

                <textarea
                  name="notes"
                  rows="4"
                  maxLength="2000"
                  value={
                    formData.notes
                  }
                  onChange={handleChange}
                />
              </label>
            </div>

            <div className="detail-form-actions">
              <button
                type="button"
                className="detail-cancel-button"
                onClick={cancelEditing}
                disabled={saving}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="detail-save-button"
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
        </>
      )}
    </main>
  )
}

export default SessionDetail