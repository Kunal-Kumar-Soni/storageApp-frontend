function ConfirmDeleteModal({ item, onConfirm, onCancel }) {
  if (!item) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4 backdrop-blur-sm"
      onClick={onCancel}
    >
      <div
        className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="text-xs font-bold uppercase tracking-[.16em] text-rose-600">
          This action cannot be undone
        </p>
        <h2 className="mt-2 text-xl font-bold text-slate-900">
          Delete {item.isDirectory ? "folder" : "file"}?
        </h2>
        <p className="mb-6 mt-2 text-sm leading-6 text-slate-500">
          Are you sure you want to delete the "{item.name}" {item.isDirectory ? "folder" : "file"}?
        </p>
        <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
          <button
            className="rounded-xl bg-rose-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-rose-700"
            onClick={() => onConfirm(item)}
          >
            Yes, Delete
          </button>
          <button
            className="rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-100"
            onClick={onCancel}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmDeleteModal;
