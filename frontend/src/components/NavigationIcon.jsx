function NavigationIcon({
  name,
  size = 18,
}) {
  const commonProps = {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.8,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    'aria-hidden': true,
  }

  const icons = {
    dashboard: (
      <>
        <rect
          x="3"
          y="3"
          width="7"
          height="7"
          rx="1"
        />
        <rect
          x="14"
          y="3"
          width="7"
          height="7"
          rx="1"
        />
        <rect
          x="3"
          y="14"
          width="7"
          height="7"
          rx="1"
        />
        <rect
          x="14"
          y="14"
          width="7"
          height="7"
          rx="1"
        />
      </>
    ),

    ride: (
      <>
        <circle
          cx="12"
          cy="12"
          r="9"
        />
        <path d="M10 8.5 16 12l-6 3.5z" />
      </>
    ),

    sessions: (
      <>
        <path d="M8 6h13" />
        <path d="M8 12h13" />
        <path d="M8 18h13" />
        <path d="M3 6h.01" />
        <path d="M3 12h.01" />
        <path d="M3 18h.01" />
      </>
    ),

    analytics: (
      <>
        <path d="M4 20V10" />
        <path d="M10 20V4" />
        <path d="M16 20v-7" />
        <path d="M22 20V7" />
      </>
    ),

    profile: (
      <>
        <circle
          cx="12"
          cy="8"
          r="4"
        />
        <path
          d="
            M4 21
            a8 8 0 0 1
            16 0
          "
        />
      </>
    ),

    logout: (
      <>
        <path d="M10 17l5-5-5-5" />
        <path d="M15 12H3" />
        <path
          d="
            M15 3h4
            a2 2 0 0 1
            2 2v14
            a2 2 0 0 1
            -2 2h-4
          "
        />
      </>
    ),
  }

  return (
    <svg {...commonProps}>
      {icons[name] || null}
    </svg>
  )
}

export default NavigationIcon