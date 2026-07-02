interface ConfirmDialogProps {
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  showCancel?: boolean;
  variant?: "danger" | "warning" | "info";
  onConfirm: () => void;
  onCancel?: () => void;
}

export function ConfirmDialog({
  title,
  message,
  confirmLabel = "OK",
  cancelLabel = "Không",
  showCancel = true,
  variant = "danger",
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const confirmStyle = !showCancel
    ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20"
    : variant === "danger"
        ? "border-red-500/30 bg-red-500/10 text-red-300 hover:bg-red-500/20"
        : variant === "warning"
        ? "border-amber-500/30 bg-amber-500/10 text-amber-300 hover:bg-amber-500/20"
        : "border-sky-500/30 bg-sky-500/10 text-sky-300 hover:bg-sky-500/20";

    const displayConfirmLabel =
    !showCancel && confirmLabel === "OK" ? "OK" : confirmLabel;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm">
      <div className="w-full max-w-sm rounded-2xl border border-white/[0.08] bg-[#101216] p-5 shadow-2xl">
        <h2 className="text-base font-semibold text-white">{title}</h2>

        <p className="mt-2 text-sm leading-6 text-zinc-400">{message}</p>

        <div className="mt-5 flex justify-end gap-3">
          {showCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="rounded-lg border border-white/[0.08] bg-white/5 px-4 py-2 text-sm font-medium text-zinc-300 transition hover:bg-white/10"
            >
              {cancelLabel}
            </button>
          )}

          <button
        type="button"
        onClick={onConfirm}
        className={`rounded-lg border px-4 py-2 text-sm font-semibold transition ${confirmStyle}`}
        >
        {displayConfirmLabel}
        </button>
        </div>
      </div>
    </div>
  );
}