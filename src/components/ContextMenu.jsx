import { useDirectoryContext } from "../context/DirectoryContext";

function ContextMenu({ item, isUploadingItem }) {
  const { handleCancelUpload, setDeleteItem, openRenameModal, openDetailsPopup } =
    useDirectoryContext();

  const menuClass =
    "absolute right-3 top-12 z-50 min-w-36 overflow-hidden rounded-xl border border-slate-200 bg-white py-1 text-sm shadow-xl shadow-slate-300/40";
  const itemClass =
    "cursor-pointer px-4 py-2.5 text-slate-600 transition hover:bg-slate-50 hover:text-slate-950";

  if (item.isDirectory) {
    return (
      <div className={menuClass}>
        <div className={itemClass} onClick={() => openRenameModal("directory", item.id, item.name)}>
          Rename
        </div>
        <div className={itemClass} onClick={() => setDeleteItem(item)}>
          Delete
        </div>
        <div className={itemClass} onClick={() => openDetailsPopup(item)}>
          Details
        </div>
      </div>
    );
  }

  if (isUploadingItem && item.isUploading) {
    return (
      <div className={menuClass}>
        <div className={itemClass} onClick={() => handleCancelUpload(item.id)}>
          Cancel
        </div>
      </div>
    );
  }

  return (
    <div className={menuClass}>
      <div
        className={itemClass}
        onClick={() =>
          (window.location.href = `${import.meta.env.VITE_BACKEND_BASE_URL}/file/${item.id}?action=download`)
        }
      >
        Download
      </div>
      <div className={itemClass} onClick={() => openRenameModal("file", item.id, item.name)}>
        Rename
      </div>
      <div className={itemClass} onClick={() => setDeleteItem(item)}>
        Delete
      </div>
      <div className={itemClass} onClick={() => openDetailsPopup(item)}>
        Details
      </div>
    </div>
  );
}

export default ContextMenu;
