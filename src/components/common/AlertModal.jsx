import { useEffect } from "react";
import { AlertTriangle, CheckCircle2, XCircle, Info } from "lucide-react";

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
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const config = {
    warning: {
      icon: AlertTriangle,
      style: "bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400",
      btn: "bg-rose-600 hover:bg-rose-700",
    },
    success: {
      icon: CheckCircle2,
      style: "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400",
      btn: "bg-emerald-600 hover:bg-emerald-700",
    },
    error: {
      icon: XCircle,
      style: "bg-rose-50 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400",
      btn: "bg-rose-600 hover:bg-rose-700",
    },
    info: {
      icon: Info,
      style: "bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400",
      btn: "bg-indigo-600 hover:bg-indigo-700",
    },
  };

  const current = config[type] || config.warning;
  const Icon = current.icon;

  const handleConfirm = () => {
    onConfirm?.();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm animate-in fade-in duration-150"
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
        className="w-full max-w-md overflow-hidden rounded-3xl border border-slate-200/80 bg-white p-6 text-slate-900 shadow-2xl dark:border-slate-800 dark:bg-slate-900 dark:text-white"
      >
        <div className="flex items-start gap-4">
          <div
            className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${current.style}`}
          >
            <Icon className="h-6 w-6" />
          </div>

          <div className="flex-1">
            <h2
              id="alert-modal-title"
              className="text-base font-bold text-slate-900 dark:text-white"
            >
              {title}
            </h2>

            <p
              id="alert-modal-message"
              className="mt-1.5 text-xs leading-relaxed text-slate-500 dark:text-slate-400"
            >
              {message}
            </p>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-2.5 pt-4 border-t border-slate-100 dark:border-slate-800">
          {showCancel && (
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 transition"
            >
              {cancelText}
            </button>
          )}

          <button
            type="button"
            onClick={handleConfirm}
            className={`rounded-xl px-5 py-2 text-xs font-bold text-white shadow-sm transition ${current.btn}`}
          >
            {buttonText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AlertModal;
