// DirectoryItem.js
import {
  FaFolder,
  FaFilePdf,
  FaFileImage,
  FaFileVideo,
  FaFileArchive,
  FaFileCode,
  FaFileAlt,
} from "react-icons/fa";
import { BsThreeDotsVertical } from "react-icons/bs";
import ContextMenu from "./ContextMenu";
import { useDirectoryContext } from "../context/DirectoryContext";
import { formatSize } from "../../utils/formatSize";

function DirectoryItem({ item, uploadProgress }) {
  const { handleRowClick, activeContextMenu, handleContextMenu, getFileIcon, isUploading } =
    useDirectoryContext();

  function renderFileIcon(iconString) {
    switch (iconString) {
      case "pdf":
        return <FaFilePdf />;
      case "image":
        return <FaFileImage />;
      case "video":
        return <FaFileVideo />;
      case "archive":
        return <FaFileArchive />;
      case "code":
        return <FaFileCode />;
      case "alt":
      default:
        return <FaFileAlt />;
    }
  }

  const isUploadingItem = item.id.startsWith("temp-");
  const isContextMenuOpen = activeContextMenu === item.id;

  return (
    <div
      className={`relative flex min-w-0 flex-col justify-between rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-md cursor-pointer ${isContextMenuOpen ? "z-10" : ""}`}
      onClick={() =>
        !(activeContextMenu || isUploading) &&
        handleRowClick(item.isDirectory ? "directory" : "file", item.id)
      }
      onContextMenu={(e) => handleContextMenu(e, item.id)}
    >
      <div
        className="flex min-w-0 items-center justify-between gap-2"
        title={`Size: ${formatSize(item.size)}\nCreate At: ${new Date(item.createdAt).toLocaleString()}`}
      >
        <div className="flex min-w-0 items-center gap-3">
          {item.isDirectory ? (
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-amber-100 text-amber-600">
              <FaFolder className="text-lg" />
            </span>
          ) : (
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-blue-100 text-blue-600">
              {renderFileIcon(getFileIcon(item.name))}
            </span>
          )}
          <span className="truncate text-sm font-semibold text-slate-800">{item.name}</span>
        </div>
        <div
          className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 cursor-pointer"
          onClick={(e) => handleContextMenu(e, item.id)}
        >
          <BsThreeDotsVertical />
        </div>
        {isContextMenuOpen && (
          <ContextMenu item={item} isUploadingItem={isUploadingItem} />
        )}
      </div>
      {isUploadingItem && (
        <div className="relative mt-3">
          <span
            className={`text-[10px] font-semibold ${uploadProgress > 50 ? "text-white" : "text-slate-600"} text-right block absolute left-1/2 top-1/2 -translate-1/2`}
          >
            {Math.floor(uploadProgress)}%
          </span>
          <div className="h-4 w-full overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-4 rounded-full"
              style={{
                width: `${uploadProgress}%`,
                backgroundColor: uploadProgress === 100 ? "#039203" : "#007bff",
              }}
            ></div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DirectoryItem;
