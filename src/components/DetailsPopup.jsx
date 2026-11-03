import { useEffect } from "react";
import { formatSize } from "../../utils/formatSize";

function DetailsPopup({ item, onClose }) {
  const { name, isDirectory, size, createdAt, updatedAt } = item;

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  if (!item) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="text-xs font-bold uppercase tracking-[.16em] text-blue-600">
          File information
        </p>
        <h2 className="mt-2 truncate text-xl font-bold text-slate-900">{name}</h2>
        <div className="mt-5 divide-y divide-slate-100 rounded-xl border border-slate-100 text-sm">
          <div className="flex justify-between gap-4 p-3">
            <span className="font-medium text-slate-500">Name</span>
            <span className="truncate font-semibold text-slate-800">{name}</span>
          </div>
          {/* <div>
            <span className="font-semibold">Path:</span> {path}
          </div> */}
          <div className="flex justify-between gap-4 p-3">
            <span className="font-medium text-slate-500">Size</span>
            <span className="font-semibold text-slate-800">{formatSize(size)}</span>
          </div>
          <div className="flex justify-between gap-4 p-3">
            <span className="font-medium text-slate-500">Created</span>
            <span className="text-right font-semibold text-slate-800">
              {new Date(createdAt).toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between gap-4 p-3">
            <span className="font-medium text-slate-500">Updated</span>
            <span className="text-right font-semibold text-slate-800">
              {new Date(updatedAt).toLocaleString()}
            </span>
          </div>
          {isDirectory && (
            <>
              {/* <div>
                <span className="font-semibold">Files:</span> {numberOfFiles}
              </div>
              <div>
                <span className="font-semibold">Folders:</span> {numberOfFolders}
              </div> */}
            </>
          )}
        </div>
        <div className="mt-6 flex justify-end">
          <button
            className="rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-700"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default DetailsPopup;
