const Modal = ({
  isOpen,
  title = "Confirmation",
  message,
  type = "info",
  confirmText = "OK",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
  showCancel = false,
}) => {
  if (!isOpen) return null;

  const styles = {
    success: {
      icon: "✓",
      iconStyle: "bg-green-100 text-green-600",
    },
    error: {
      icon: "✕",
      iconStyle: "bg-red-100 text-red-600",
    },
    warning: {
      icon: "!",
      iconStyle: "bg-amber-100 text-amber-600",
    },
    info: {
      icon: "i",
      iconStyle: "bg-blue-100 text-blue-600",
    },
  };

  const currentStyle = styles[type] || styles.info;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onCancel}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start gap-4">
          <div
            className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-xl font-bold ${currentStyle.iconStyle}`}
          >
            {currentStyle.icon}
          </div>

          <div className="flex-1">
            <h2
              id="modal-title"
              className="text-lg font-semibold text-gray-900"
            >
              {title}
            </h2>

            <p className="mt-2 text-sm leading-6 text-gray-600">
              {message}
            </p>
          </div>
        </div>

        <div className="mt-7 flex justify-end gap-3">
          {showCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
            >
              {cancelText}
            </button>
          )}

          <button
            type="button"
            onClick={onConfirm}
            className={`rounded-lg px-4 py-2 text-sm font-semibold text-white transition ${
              type === "error"
                ? "bg-red-600 hover:bg-red-700"
                : type === "warning"
                  ? "bg-amber-600 hover:bg-amber-700"
                  : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;