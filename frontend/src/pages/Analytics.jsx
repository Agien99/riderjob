import {
  useEffect,
  useState,
} from 'react'

import {
  getAnalytics,
} from '../services/analyticsService'

import '../styles/analytics.css'


const PERIODS = [
  {
    value: '7d',
    label: 'Last 7 Days',
  },
  {
    value: '30d',
    label: 'Last 30 Days',
  },
  {
    value: 'month',
    label: 'This Month',
  },
  {
    value: '3m',
    label: 'Last 3 Months',
  },
  {
    value: 'all',
    label: 'All Time',
  },
]


const PLATFORM_LABELS = {
  shopeefood: 'ShopeeFood',
  grabfood: 'GrabFood',
  lalamove: 'Lalamove',
}


function Analytics() {
  const [
    period,
    setPeriod,
  ] = useState('30d')

  const [
    analytics,
    setAnalytics,
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

    getAnalytics(period)
      .then((data) => {
        if (cancelled) {
          return
        }

        setAnalytics(data)
        setError('')
      })
      .catch((err) => {
        if (cancelled) {
          return
        }

        setError(
          err.message ||
            'Unable to load analytics.',
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
        await getAnalytics(period)

      setAnalytics(data)
    } catch (err) {
      setError(
        err.message ||
          'Unable to load analytics.',
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
    return Number(
      value || 0,
    ).toFixed(decimals)
  }


  function formatHours(value) {
    const hours = Number(
      value || 0,
    )

    if (hours <= 0) {
      return '0 hr'
    }

    const totalMinutes = Math.round(
      hours * 60,
    )

    const wholeHours = Math.floor(
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


  function formatShortDate(value) {
    if (!value) {
      return '-'
    }

    return new Intl.DateTimeFormat(
      'en-MY',
      {
        day: 'numeric',
        month: 'short',
      },
    ).format(
      new Date(
        `${value}T00:00:00`,
      ),
    )
  }


  function formatPlatform(platform) {
    return (
      PLATFORM_LABELS[platform] ||
      platform ||
      '-'
    )
  }


  function getPeriodLabel() {
    return (
      PERIODS.find(
        (item) =>
          item.value === period,
      )?.label || 'Last 30 Days'
    )
  }


  function getChartHeight(
    value,
    maximum,
  ) {
    const numericValue = Math.max(
      Number(value || 0),
      0,
    )

    if (
      numericValue === 0 ||
      maximum <= 0
    ) {
      return 0
    }

    return Math.max(
      (numericValue / maximum) * 100,
      4,
    )
  }


  const summary =
    analytics?.summary

  const earningsTrend =
    analytics?.earnings_trend || []

  const ordersTrend =
    analytics?.orders_trend || []

  const platformSummary =
    analytics?.platform_summary || []

  const weekdaySummary =
    analytics?.weekday_summary || []

  const highlights =
    analytics?.highlights

  const maximumEarnings = Math.max(
    0,
    ...earningsTrend.map(
      (item) =>
        Math.max(
          Number(
            item.gross_income || 0,
          ),
          Number(
            item.net_income || 0,
          ),
        ),
    ),
  )

  const maximumOrders = Math.max(
    0,
    ...ordersTrend.map(
      (item) =>
        Number(item.orders || 0),
    ),
  )

  const hasActivity =
    Number(
      summary?.total_sessions || 0,
    ) > 0


  return (
    <main className="analytics-page">
      <header className="analytics-header">
        <div>
          <p className="analytics-eyebrow">
            RIDER INSIGHTS
          </p>

          <h1>
            Analytics
          </h1>

          <p className="analytics-subtitle">
            Understand your earnings,
            efficiency and platform
            performance over time.
          </p>
        </div>
      </header>


      <section className="analytics-period-section">
        <div className="analytics-period-tabs">
          {PERIODS.map(
            (item) => (
              <button
                key={item.value}
                type="button"
                className={
                  period === item.value
                    ? 'analytics-period-button active'
                    : 'analytics-period-button'
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

        {analytics && (
          <span className="analytics-period-range">
            {formatDate(
              analytics.start_date,
            )}

            {' — '}

            {formatDate(
              analytics.end_date,
            )}
          </span>
        )}
      </section>


      {error && (
        <div className="analytics-error">
          <span>
            {error}
          </span>

          <button
            type="button"
            onClick={handleRetry}
          >
            Try Again
          </button>
        </div>
      )}


      {loading && (
        <div className="analytics-loading">
          Loading{' '}
          {getPeriodLabel()}{' '}
          analytics...
        </div>
      )}


      {!loading &&
        !error &&
        analytics &&
        summary && (
          <>
            <section className="analytics-summary-grid">
              <article className="analytics-summary-card analytics-summary-primary">
                <span>
                  Net Earnings
                </span>

                <strong>
                  {formatMoney(
                    summary.net_income,
                  )}
                </strong>

                <small>
                  After recorded expenses
                </small>
              </article>


              <article className="analytics-summary-card">
                <span>
                  Gross Earnings
                </span>

                <strong>
                  {formatMoney(
                    summary.gross_income,
                  )}
                </strong>

                <small>
                  Before expenses
                </small>
              </article>


              <article className="analytics-summary-card">
                <span>
                  Orders
                </span>

                <strong>
                  {summary.total_orders}
                </strong>

                <small>
                  Completed deliveries
                </small>
              </article>


              <article className="analytics-summary-card">
                <span>
                  Distance
                </span>

                <strong>
                  {formatNumber(
                    summary.total_distance_km,
                  )}
                  {' km'}
                </strong>

                <small>
                  Total recorded distance
                </small>
              </article>


              <article className="analytics-summary-card">
                <span>
                  Riding Time
                </span>

                <strong>
                  {formatHours(
                    summary.total_hours,
                  )}
                </strong>

                <small>
                  Completed session time
                </small>
              </article>


              <article className="analytics-summary-card">
                <span>
                  Sessions
                </span>

                <strong>
                  {summary.total_sessions}
                </strong>

                <small>
                  Completed sessions
                </small>
              </article>
            </section>


            <section className="analytics-efficiency-grid">
              <article>
                <span>
                  RM / Hour
                </span>

                <strong>
                  {
                    summary.income_per_hour ===
                    null
                      ? '-'
                      : formatMoney(
                          summary.income_per_hour,
                        )
                  }
                </strong>
              </article>

              <article>
                <span>
                  RM / Order
                </span>

                <strong>
                  {
                    summary.income_per_order ===
                    null
                      ? '-'
                      : formatMoney(
                          summary.income_per_order,
                        )
                  }
                </strong>
              </article>

              <article>
                <span>
                  RM / KM
                </span>

                <strong>
                  {
                    summary.income_per_km ===
                    null
                      ? '-'
                      : formatMoney(
                          summary.income_per_km,
                        )
                  }
                </strong>
              </article>

              <article>
                <span>
                  Expense Ratio
                </span>

                <strong>
                  {
                    summary.expense_ratio ===
                    null
                      ? '-'
                      : `${formatNumber(
                          summary.expense_ratio,
                        )}%`
                  }
                </strong>
              </article>
            </section>


            {!hasActivity && (
              <section className="analytics-empty-state">
                <h2>
                  No activity for this
                  period
                </h2>

                <p>
                  Complete rider sessions
                  to build your analytics.
                </p>
              </section>
            )}


            <div className="analytics-chart-grid">
              <section className="analytics-panel">
                <div className="analytics-panel-header">
                  <div>
                    <p className="analytics-eyebrow">
                      EARNINGS
                    </p>

                    <h2>
                      Earnings Trend
                    </h2>
                  </div>

                  <div className="analytics-chart-legend">
                    <span>
                      <i className="analytics-legend-gross" />
                      Gross
                    </span>

                    <span>
                      <i className="analytics-legend-net" />
                      Net
                    </span>
                  </div>
                </div>


                {earningsTrend.length ===
                0 ? (
                  <div className="analytics-no-chart">
                    No earnings data
                    available.
                  </div>
                ) : (
                  <div className="analytics-chart-scroll">
                    <div className="analytics-bar-chart">
                      {earningsTrend.map(
                        (item) => (
                          <div
                            key={
                              item.date
                            }
                            className="analytics-chart-column"
                          >
                            <div className="analytics-bars">
                              <div
                                className="analytics-bar analytics-bar-gross"
                                style={{
                                  height:
                                    `${getChartHeight(
                                      item.gross_income,
                                      maximumEarnings,
                                    )}%`,
                                }}
                                title={
                                  `Gross: ${formatMoney(
                                    item.gross_income,
                                  )}`
                                }
                              />

                              <div
                                className="analytics-bar analytics-bar-net"
                                style={{
                                  height:
                                    `${getChartHeight(
                                      item.net_income,
                                      maximumEarnings,
                                    )}%`,
                                }}
                                title={
                                  `Net: ${formatMoney(
                                    item.net_income,
                                  )}`
                                }
                              />
                            </div>

                            <span>
                              {formatShortDate(
                                item.date,
                              )}
                            </span>
                          </div>
                        ),
                      )}
                    </div>
                  </div>
                )}
              </section>


              <section className="analytics-panel">
                <div className="analytics-panel-header">
                  <div>
                    <p className="analytics-eyebrow">
                      DELIVERIES
                    </p>

                    <h2>
                      Orders Trend
                    </h2>
                  </div>
                </div>


                {ordersTrend.length ===
                0 ? (
                  <div className="analytics-no-chart">
                    No order data
                    available.
                  </div>
                ) : (
                  <div className="analytics-chart-scroll">
                    <div className="analytics-bar-chart">
                      {ordersTrend.map(
                        (item) => (
                          <div
                            key={
                              item.date
                            }
                            className="analytics-chart-column"
                          >
                            <div className="analytics-bars analytics-single-bars">
                              <div
                                className="analytics-bar analytics-bar-orders"
                                style={{
                                  height:
                                    `${getChartHeight(
                                      item.orders,
                                      maximumOrders,
                                    )}%`,
                                }}
                                title={
                                  `${item.orders} orders`
                                }
                              />
                            </div>

                            <span>
                              {formatShortDate(
                                item.date,
                              )}
                            </span>
                          </div>
                        ),
                      )}
                    </div>
                  </div>
                )}
              </section>
            </div>


            <section className="analytics-panel">
              <div className="analytics-panel-header">
                <div>
                  <p className="analytics-eyebrow">
                    PLATFORM COMPARISON
                  </p>

                  <h2>
                    Performance by Platform
                  </h2>
                </div>
              </div>


              <div className="analytics-platform-grid">
                {platformSummary.map(
                  (item) => (
                    <article
                      key={
                        item.platform
                      }
                      className={
                        `analytics-platform-card ` +
                        `analytics-platform-${item.platform}`
                      }
                    >
                      <div className="analytics-platform-heading">
                        <div>
                          <strong>
                            {formatPlatform(
                              item.platform,
                            )}
                          </strong>

                          <span>
                            {
                              item.total_sessions
                            }{' '}
                            {
                              item.total_sessions ===
                              1
                                ? 'session'
                                : 'sessions'
                            }
                          </span>
                        </div>

                        <strong>
                          {formatMoney(
                            item.net_income,
                          )}
                        </strong>
                      </div>


                      <div className="analytics-platform-metrics">
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
                            Distance
                          </span>

                          <strong>
                            {formatNumber(
                              item.total_distance_km,
                            )}
                            {' km'}
                          </strong>
                        </div>

                        <div>
                          <span>
                            Time
                          </span>

                          <strong>
                            {formatHours(
                              item.total_hours,
                            )}
                          </strong>
                        </div>

                        <div>
                          <span>
                            RM / Hour
                          </span>

                          <strong>
                            {
                              item.income_per_hour ===
                              null
                                ? '-'
                                : formatMoney(
                                    item.income_per_hour,
                                  )
                            }
                          </strong>
                        </div>

                        <div>
                          <span>
                            RM / Order
                          </span>

                          <strong>
                            {
                              item.income_per_order ===
                              null
                                ? '-'
                                : formatMoney(
                                    item.income_per_order,
                                  )
                            }
                          </strong>
                        </div>

                        <div>
                          <span>
                            RM / KM
                          </span>

                          <strong>
                            {
                              item.income_per_km ===
                              null
                                ? '-'
                                : formatMoney(
                                    item.income_per_km,
                                  )
                            }
                          </strong>
                        </div>

                        <div>
                          <span>
                            Fuel
                          </span>

                          <strong>
                            {formatMoney(
                              item.fuel_cost,
                            )}
                          </strong>
                        </div>
                      </div>
                    </article>
                  ),
                )}
              </div>
            </section>


            <div className="analytics-lower-grid">
              <section className="analytics-panel">
                <div className="analytics-panel-header">
                  <div>
                    <p className="analytics-eyebrow">
                      WEEKLY PATTERN
                    </p>

                    <h2>
                      Day of Week
                    </h2>
                  </div>
                </div>


                <div className="analytics-weekday-list">
                  {weekdaySummary.map(
                    (item) => (
                      <div
                        key={
                          item.weekday
                        }
                        className="analytics-weekday-row"
                      >
                        <div className="analytics-weekday-name">
                          <strong>
                            {
                              item.weekday
                            }
                          </strong>

                          <span>
                            {
                              item.total_sessions
                            }{' '}
                            {
                              item.total_sessions ===
                              1
                                ? 'session'
                                : 'sessions'
                            }
                          </span>
                        </div>

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
                            Net
                          </span>

                          <strong>
                            {formatMoney(
                              item.net_income,
                            )}
                          </strong>
                        </div>

                        <div>
                          <span>
                            RM / Hour
                          </span>

                          <strong>
                            {
                              item.income_per_hour ===
                              null
                                ? '-'
                                : formatMoney(
                                    item.income_per_hour,
                                  )
                            }
                          </strong>
                        </div>
                      </div>
                    ),
                  )}
                </div>
              </section>


              <section className="analytics-panel">
                <div className="analytics-panel-header">
                  <div>
                    <p className="analytics-eyebrow">
                      COST BREAKDOWN
                    </p>

                    <h2>
                      Expenses
                    </h2>
                  </div>
                </div>


                <div className="analytics-expense-list">
                  <div>
                    <span>
                      Gross Income
                    </span>

                    <strong>
                      {formatMoney(
                        summary.gross_income,
                      )}
                    </strong>
                  </div>

                  <div>
                    <span>
                      Fuel Cost
                    </span>

                    <strong>
                      -
                      {formatMoney(
                        summary.fuel_cost,
                      )}
                    </strong>
                  </div>

                  <div>
                    <span>
                      Other Expenses
                    </span>

                    <strong>
                      -
                      {formatMoney(
                        summary.other_expenses,
                      )}
                    </strong>
                  </div>

                  <div className="analytics-expense-total">
                    <span>
                      Total Expenses
                    </span>

                    <strong>
                      {formatMoney(
                        summary.total_expenses,
                      )}
                    </strong>
                  </div>

                  <div className="analytics-net-total">
                    <span>
                      Net Earnings
                    </span>

                    <strong>
                      {formatMoney(
                        summary.net_income,
                      )}
                    </strong>
                  </div>
                </div>
              </section>
            </div>


            <section className="analytics-panel">
              <div className="analytics-panel-header">
                <div>
                  <p className="analytics-eyebrow">
                    PERFORMANCE HIGHLIGHTS
                  </p>

                  <h2>
                    Best Performance
                  </h2>
                </div>
              </div>


              <div className="analytics-highlight-grid">
                <article>
                  <span>
                    Best Earning Day
                  </span>

                  <strong>
                    {
                      highlights
                        ?.best_earning_day
                        ? formatMoney(
                            highlights
                              .best_earning_day
                              .value,
                          )
                        : '-'
                    }
                  </strong>

                  <small>
                    {
                      highlights
                        ?.best_earning_day
                        ? formatDate(
                            highlights
                              .best_earning_day
                              .date,
                          )
                        : 'No data'
                    }
                  </small>
                </article>


                <article>
                  <span>
                    Best RM / Hour Day
                  </span>

                  <strong>
                    {
                      highlights
                        ?.best_efficiency_day
                        ? formatMoney(
                            highlights
                              .best_efficiency_day
                              .value,
                          )
                        : '-'
                    }
                  </strong>

                  <small>
                    {
                      highlights
                        ?.best_efficiency_day
                        ? formatDate(
                            highlights
                              .best_efficiency_day
                              .date,
                          )
                        : 'Minimum 1 riding hour'
                    }
                  </small>
                </article>


                <article>
                  <span>
                    Highest Net Platform
                  </span>

                  <strong>
                    {
                      highlights
                        ?.best_platform_net
                        ? formatPlatform(
                            highlights
                              .best_platform_net
                              .platform,
                          )
                        : '-'
                    }
                  </strong>

                  <small>
                    {
                      highlights
                        ?.best_platform_net
                        ? formatMoney(
                            highlights
                              .best_platform_net
                              .value,
                          )
                        : 'No data'
                    }
                  </small>
                </article>


                <article>
                  <span>
                    Most Efficient Platform
                  </span>

                  <strong>
                    {
                      highlights
                        ?.best_platform_efficiency
                        ? formatPlatform(
                            highlights
                              .best_platform_efficiency
                              .platform,
                          )
                        : '-'
                    }
                  </strong>

                  <small>
                    {
                      highlights
                        ?.best_platform_efficiency
                        ? `${formatMoney(
                            highlights
                              .best_platform_efficiency
                              .value,
                          )} / hour`
                        : 'No data'
                    }
                  </small>
                </article>
              </div>
            </section>
          </>
        )}
    </main>
  )
}


export default Analytics