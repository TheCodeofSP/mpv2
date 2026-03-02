import { useEffect } from "react";
import { createPortal } from "react-dom";
import "./toast.scss";

export default function Toast({
  open,
  type = "info", // success | error | info
  title,
  message,
  onClose,
  duration = 3500, // auto-close (ms) - null/0 => désactivé
}) {
  // Auto-close
  useEffect(() => {
    if (!open) return;
    if (!duration) return;

    const t = window.setTimeout(() => {
      onClose?.();
    }, duration);

    return () => window.clearTimeout(t);
  }, [open, duration, onClose]);

  // Escape to close
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e) => {
      if (e.key === "Escape") onClose?.();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  const content = (
    <div
      className={`toast toast--${type}`}
      role={type === "error" ? "alert" : "status"}
      aria-live={type === "error" ? "assertive" : "polite"}
      aria-atomic="true"
    >
      <div className="toast__body">
        {title && <p className="toast__title">{title}</p>}
        {message && <p className="toast__msg">{message}</p>}
      </div>

      <button
        type="button"
        className="toast__close"
        onClick={onClose}
        aria-label="Fermer"
        title="Fermer"
      >
        ×
      </button>
    </div>
  );

  return createPortal(content, document.body);
}