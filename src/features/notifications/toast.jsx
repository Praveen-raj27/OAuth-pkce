import { useEffect } from "react";

function Toast({
  id,
  type,
  message,
  duration,
  onClose,
}) {
  useEffect(() => {
    if (!duration) return;

    const timer = setTimeout(() => {
      onClose(id);
    }, duration);

    return () => {
      clearTimeout(timer);
    };
  }, [id, duration, onClose]);

  return (
    <div className={`toast toast-${type}`}>
      <div className="toast-content">
        <strong>{type.toUpperCase()}</strong>

        <span>{message}</span>
      </div>

      <button
        className="toast-close"
        onClick={() => onClose(id)}
      >
        ×
      </button>
    </div>
  );
}

export default Toast;