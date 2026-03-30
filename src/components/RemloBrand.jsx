import { useMemo, useState } from 'react'

const GREEN = '#1d9e75' // matte green
const GREEN_DARK = '#0f6e56'
const INK = '#0f1729'

function IconMark({ variant = 0 }) {
  // Pure SVG icon mark (no fonts) so it stays consistent across machines.
  if (variant === 1) {
    return (
      <g aria-hidden>
        <circle cx="14" cy="14" r="12" fill={GREEN} opacity="0.95" />
        <path
          d="M11 20V8h5.2c2 0 3.3 1.2 3.3 2.9 0 1-.5 1.9-1.5 2.4l2 4.7h-3.1l-1.5-4h-1.3v4H11z"
          fill="#fff"
        />
      </g>
    )
  }

  if (variant === 2) {
    return (
      <g aria-hidden>
        <path
          d="M4 18c1.8 3.5 5.1 6 10 6 8.5 0 12-10 6-16-1.7-1.7-4-2.7-6.7-2.7-4.2 0-7.6 2.3-9 5.8l3.4 1.3c.8-2.1 2.8-3.6 5.6-3.6 2.4 0 4.2 1.1 5 2.8 1.4 3.1-.2 7-4.1 7-2.1 0-3.8-1-4.7-2.5L4 18z"
          fill={GREEN}
        />
      </g>
    )
  }

  // variant 0 (default)
  return (
    <g aria-hidden>
      <circle cx="14" cy="14" r="12" fill={GREEN} opacity="0.12" />
      <circle cx="14" cy="14" r="8" fill={GREEN} opacity="0.95" />
      <path d="M10 9h8v3h-2v8h-4v-8h-2V9z" fill="#fff" />
    </g>
  )
}

export default function RemloBrand({ size = 120, onClickCycle = false, initialVariant = 0 }) {
  const [variant, setVariant] = useState(initialVariant)

  const viewBox = useMemo(() => `0 0 120 28`, [])
  const height = 28
  const width = Math.max(28, size)

  function handleClick() {
    if (!onClickCycle) return
    setVariant((v) => (v + 1) % 3)
  }

  // Small wordmark built from SVG paths (simple + consistent)
  const word = (
    <g aria-hidden>
      <text x="30" y="18" fill={INK} fontSize="14" fontWeight="600" fontFamily="DM Sans, system-ui, sans-serif">
        Remlo
      </text>
      <rect x="30" y="20.2" width="48" height="3" rx="1.5" fill={GREEN_DARK} opacity="0.25" />
      <circle cx="78" cy="14" r="3.2" fill={GREEN} />
    </g>
  )

  const altWord = (
    <g aria-hidden>
      <text x="28" y="18" fill={INK} fontSize="14" fontWeight="600" fontFamily="DM Sans, system-ui, sans-serif">
        Remlo
      </text>
    </g>
  )

  const compactWord = (
    <g aria-hidden>
      <text x="30" y="18" fill={INK} fontSize="13" fontWeight="600" fontFamily="DM Sans, system-ui, sans-serif">
        Remlo
      </text>
      <path d="M34 22h42" stroke={GREEN} strokeWidth="2" strokeLinecap="round" opacity="0.25" />
    </g>
  )

  return (
    <div
      role={onClickCycle ? 'button' : undefined}
      tabIndex={onClickCycle ? 0 : undefined}
      onClick={handleClick}
      onKeyDown={(e) => e.key === 'Enter' && handleClick()}
      style={{ display: 'inline-flex', alignItems: 'center', cursor: onClickCycle ? 'pointer' : 'default' }}
    >
      <svg width={width} height={height} viewBox={viewBox} fill="none" xmlns="http://www.w3.org/2000/svg">
        <IconMark variant={variant} />
        {variant === 2 ? compactWord : altWord}
        {variant === 0 ? word : null}
      </svg>
    </div>
  )
}
