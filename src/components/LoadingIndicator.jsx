export default function LoadingIndicator({ label = "Loading", fullScreen = false }) {
  return (
    <div
      className={
        fullScreen
          ? "flex min-h-72 items-center justify-center"
          : "flex items-center justify-center py-8"
      }
      role="status"
      aria-live="polite"
    >
      <div className="flex items-center gap-3 rounded-xl bg-white px-4 py-3 text-sm font-medium text-slate-600 shadow-sm ring-1 ring-slate-200">
        <span
          className="h-4 w-4 animate-spin rounded-full border-2 border-slate-200 border-t-blue-600"
          aria-hidden="true"
        />
        {label}
      </div>
    </div>
  );
}
