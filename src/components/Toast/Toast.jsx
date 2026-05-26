import { useEffect } from 'react'

export function Toast({ message, onClose }) {
  useEffect(() => {
    if (!message) return
    const timer = setTimeout(onClose, 3000)
    return () => clearTimeout(timer)
  }, [message, onClose])

  if (!message) return null

  return (
    <div className="toast" onClick={onClose} role="alert">
      <span className="toast-text">{message}</span>
      <button className="toast-close-btn" aria-label="Chiudi">✕</button>
    </div>
  )
}
