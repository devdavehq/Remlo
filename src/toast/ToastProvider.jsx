import { useMemo, useRef, useState } from 'react'

import { ToastContext } from './ToastContext'

function ToastDot({ type }) {
  const color = type === 'success' ? 'var(--accent)' : type === 'error' ? 'var(--danger)' : 'var(--accent-muted)'
  return <span className="toast-dot" style={{ background: color }} aria-hidden />
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])
  const timersRef = useRef(new Map())

  const api = useMemo(() => {
    function addToast(message, type = 'info') {
      const id = `${Date.now()}-${Math.random().toString(16).slice(2)}`

      setToasts((prev) => [...prev, { id, message, type }])

      const timer = window.setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id))
        timersRef.current.delete(id)
      }, 3200)

      timersRef.current.set(id, timer)
    }

    return { addToast }
  }, [])

  return (
    <ToastContext.Provider value={api}>
      {children}
      <div className="toast-stack" aria-live="polite" aria-relevant="additions">
        {toasts.map((t) => (
          <div key={t.id} className={`toast ${t.type}`}>
            <ToastDot type={t.type} />
            <div className="toast-msg">{t.message}</div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

