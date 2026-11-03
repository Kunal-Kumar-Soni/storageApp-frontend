import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { fetchUser, logoutUser, logoutAllSessions } from "../api/userApi";
import { FaFolderPlus, FaUpload, FaUser, FaSignOutAlt, FaSignInAlt } from "react-icons/fa";
import { formatSize } from "../../utils/formatSize";
import UserAvatar from "./UserAvatar";
import BrandMark from "./BrandMark";

function DirectoryHeader({
  directoryName,
  onCreateFolderClick,
  onUploadFilesClick,
  fileInputRef,
  handleFileSelect,
  storageVersion,
  disabled = false,
}) {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [userName, setUserName] = useState("Guest User");
  const [userEmail, setUserEmail] = useState("guest@example.com");
  const [maxStorageInBytes, setMaxStorageInBytes] = useState(1024 ** 3);
  const [usedStorageInBytes, setUsedStorageInBytes] = useState(0);
  const [isLoadingUser, setIsLoadingUser] = useState(true);

  const userMenuRef = useRef(null);
  const navigate = useNavigate();

  async function loadUser() {
    setIsLoadingUser(true);
    try {
      const user = await fetchUser();
      setUserName(user.name);
      setUserEmail(user.email);
      setMaxStorageInBytes(user.maxStorageInBytes);
      setUsedStorageInBytes(user.usedStorageInBytes);
      // setUserPicture(user.picture);
      setLoggedIn(true);
    } catch (err) {
      console.log("Load User Error:", err);
      setLoggedIn(false);
      setUserName("Guest User");
      setUserEmail("guest@example.com");
    } finally {
      setIsLoadingUser(false);
    }
  }

  useEffect(() => {
    loadUser();
  }, [storageVersion]);

  const handleUserIconClick = () => {
    setShowUserMenu((prev) => !prev);
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
      setLoggedIn(false);
      setUserName("Guest User");
      setUserEmail("guest@example.com");
      navigate("/login");
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      setShowUserMenu(false);
    }
  };

  const handleLogoutAll = async () => {
    try {
      await logoutAllSessions();
      setLoggedIn(false);
      setUserName("Guest User");
      setUserEmail("guest@example.com");
      navigate("/login");
    } catch (err) {
      console.error("Logout all error:", err);
    } finally {
      setShowUserMenu(false);
    }
  };

  useEffect(() => {
    function handleDocumentClick(e) {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setShowUserMenu(false);
      }
    }
    document.addEventListener("mousedown", handleDocumentClick);
    return () => document.removeEventListener("mousedown", handleDocumentClick);
  }, []);

  return (
    <header className="mb-7 flex flex-col gap-4 border-b border-slate-200 px-1 pb-5 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex min-w-0 items-center gap-3">
        <Link to="/" title="StorageApp home">
          <BrandMark className="h-10 w-10" />
        </Link>
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-[.16em] text-blue-600">
            My storage
          </p>
          <h1 className="truncate text-xl font-bold text-slate-900">{directoryName}</h1>
        </div>
      </div>
      <div className="flex items-center gap-2 sm:gap-3">
        <button
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          title="Create Folder"
          onClick={onCreateFolderClick}
          disabled={disabled}
        >
          <FaFolderPlus /> <span className="hidden sm:inline">New folder</span>
        </button>
        <button
          className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-3 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          title="Upload Files"
          onClick={async () => {
            onUploadFilesClick();
          }}
          disabled={disabled}
        >
          <FaUpload /> <span className="hidden sm:inline">Upload</span>
        </button>
        <input
          ref={fileInputRef}
          id="file-upload"
          type="file"
          className="hidden"
          multiple
          onChange={handleFileSelect}
        />
        <div className="relative flex" ref={userMenuRef}>
          <button
            className="grid h-10 w-10 place-items-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50 hover:text-slate-950"
            title="User Menu"
            onClick={handleUserIconClick}
          >
            {loggedIn ? <UserAvatar name={userName} className="h-8 w-8" /> : <FaUser />}
          </button>

          {showUserMenu && (
            <div className="fixed inset-x-4 top-32 z-50 overflow-hidden rounded-2xl border border-slate-200 bg-white py-2 shadow-2xl shadow-slate-300/40 sm:absolute sm:inset-auto sm:right-0 sm:top-11 sm:w-72 sm:shadow-xl">
              {loggedIn ? (
                <>
                  <div className="px-4 py-3 text-sm text-slate-800">
                    <div className="font-semibold">{userName}</div>
                    <div className="mt-0.5 text-xs text-slate-500">{userEmail}</div>
                    <div className="mt-3 flex flex-col text-xs">
                      <div className="mb-1 h-1.5 overflow-hidden rounded-full bg-slate-100">
                        <div
                          className="h-full rounded-full bg-blue-600"
                          style={{ width: `${(usedStorageInBytes / maxStorageInBytes) * 100}%` }}
                        ></div>
                      </div>
                      <div className="text-xs">
                        {isLoadingUser
                          ? "Loading storage…"
                          : `${formatSize(usedStorageInBytes)} of ${formatSize(maxStorageInBytes)}`}
                      </div>
                    </div>
                  </div>
                  <div className="my-1 border-t border-slate-100" />
                  <Link
                    to="/plans"
                    className="mx-2 flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-blue-700 transition hover:bg-blue-50"
                  >
                    Get More Storage
                  </Link>
                  <div
                    className="mx-2 flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-slate-600 transition hover:bg-slate-50"
                    onClick={handleLogout}
                  >
                    <FaSignOutAlt className="text-slate-400" /> Logout
                  </div>
                  <div
                    className="mx-2 flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-slate-600 transition hover:bg-slate-50"
                    onClick={handleLogoutAll}
                  >
                    <FaSignOutAlt className="text-slate-400" /> Logout all devices
                  </div>
                </>
              ) : (
                <div
                  className="mx-2 flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-slate-600 transition hover:bg-slate-50"
                  onClick={() => {
                    navigate("/login");
                    setShowUserMenu(false);
                  }}
                >
                  <FaSignInAlt className="text-blue-600" /> Log in
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default DirectoryHeader;
