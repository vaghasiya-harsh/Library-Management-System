import { useEffect } from "react";

const AlertModal = ({
  isOpen,
  onClose,
  title = "Are you sure?",
  message = "Do you want to continue?",
  type = "warning",
  buttonText = "Confirm",
  showCancel = true,
  cancelText = "Cancel",
  onConfirm,
}) => {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const iconStyles = {
    warning: "bg-amber-100 text-amber-600",
    success: "bg-green-100 text-green-600",
    error: "bg-red-100 text-red-600",
    info: "bg-blue-100 text-blue-600",
  };

  const icons = {
    warning: "!",
    success: "✓",
    error: "×",
    info: "i",
  };

  const handleConfirm = () => {
    onConfirm?.();
  };

  return (
    <div
      className="fixed inset-0 z-100 flex items-center justify-center bg-black/60 p-4"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="alert-modal-title"
        aria-describedby="alert-modal-message"
        className="w-full max-w-md rounded-2xl bg-white p-6 text-gray-900 shadow-2xl"
      >
        <div className="flex items-start gap-4">
          <div
            className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-2xl font-bold ${
              iconStyles[type] || iconStyles.warning
            }`}
          >
            {icons[type] || icons.warning}
          </div>

          <div className="flex-1">
            <h2
              id="alert-modal-title"
              className="text-xl font-bold"
            >
              {title}
            </h2>

            <p
              id="alert-modal-message"
              className="mt-2 text-sm leading-6 text-gray-600"
            >
              {message}
            </p>
          </div>
        </div>

        <div className="mt-7 flex justify-end gap-3">
          {showCancel && (
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-200"
            >
              {cancelText}
            </button>
          )}

          <button
            type="button"
            onClick={handleConfirm}
            className="rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-700"
          >
            {buttonText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AlertModal;
