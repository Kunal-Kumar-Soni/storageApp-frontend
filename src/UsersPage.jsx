import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchAllUsers, fetchUser, deleteUserById, logoutUserById } from "./api/userApi";
import LoadingIndicator from "./components/LoadingIndicator";

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [userName, setUserName] = useState("Guest User");
  const [userEmail, setUserEmail] = useState("");
  const [userRole, setUserRole] = useState("User");
  const [isLoading, setIsLoading] = useState(true);
  const [actionUserId, setActionUserId] = useState(null);
  const navigate = useNavigate();

  async function fetchUsers() {
    setIsLoading(true);
    try {
      const data = await fetchAllUsers();
      setUsers(data);
    } catch (err) {
      if (err.response?.status === 403) navigate("/");
      else if (err.response?.status === 401) navigate("/login");
      else console.error("Fetching users failed:", err);
    } finally {
      setIsLoading(false);
    }
  }

  async function fetchCurrentUser() {
    try {
      const data = await fetchUser();
      setUserName(data.name);
      setUserEmail(data.email);
      setUserRole(data.role);
    } catch (err) {
      if (err.response?.status === 401) navigate("/login");
      else console.error("Fetching user failed:", err);
    }
  }

  const logoutUser = async (user) => {
    const confirmed = confirm(`You are about to logout ${user.email}`);
    if (!confirmed) return;
    try {
      setActionUserId(user.id);
      await logoutUserById(user.id);
      await fetchUsers();
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      setActionUserId(null);
    }
  };

  const deleteUser = async (user) => {
    const confirmed = confirm(`You are about to delete ${user.email}`);
    if (!confirmed) return;
    try {
      setActionUserId(user.id);
      await deleteUserById(user.id);
      fetchUsers();
    } catch (err) {
      console.error("Delete error:", err);
    } finally {
      setActionUserId(null);
    }
  };

  useEffect(async () => {
    await fetchUsers();
    await fetchCurrentUser();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex items-start justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div>
            <p className="text-xs font-bold uppercase tracking-[.16em] text-blue-600">
              Administration
            </p>
            <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">Members</h1>
            <p className="mt-2 text-sm text-slate-500">
              <b>{userName}</b>: <i>({userRole})</i>
            </p>
          </div>
        </div>

        {isLoading ? (
          <LoadingIndicator label="Loading members…" />
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
            <table className="w-full min-w-175 border-collapse text-sm">
              <thead>
                <tr>
                  <th className="border-b border-slate-200 bg-slate-50 p-4 text-left font-semibold text-slate-600">
                    Name
                  </th>
                  <th className="border-b border-slate-200 bg-slate-50 p-4 text-left font-semibold text-slate-600">
                    Email
                  </th>
                  <th className="border-b border-slate-200 bg-slate-50 p-4 text-left font-semibold text-slate-600">
                    Status
                  </th>
                  <th className="border-b border-slate-200 bg-slate-50 p-4 text-left font-semibold text-slate-600"></th>
                  {userRole === "Admin" && (
                    <th className="border-b border-slate-200 bg-slate-50 p-4 text-left font-semibold text-slate-600"></th>
                  )}
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td className="border-b border-slate-100 p-4 font-semibold text-slate-800">
                      {user.name}
                    </td>
                    <td className="border-b border-slate-100 p-4 text-slate-500">{user.email}</td>
                    <td className="border-b border-slate-100 p-4">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-semibold ${user.isLoggedIn ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-500"}`}
                      >
                        {user.isLoggedIn ? "Logged In" : "Logged Out"}
                      </span>
                    </td>
                    <td className="border-b border-slate-100 p-4">
                      <button
                        onClick={() => logoutUser(user)}
                        disabled={!user.isLoggedIn || actionUserId === user.id}
                        className={`px-3 py-1 text-sm text-white rounded ${
                          user.isLoggedIn
                            ? "bg-slate-900 hover:bg-slate-700"
                            : "bg-slate-200 cursor-not-allowed"
                        }`}
                      >
                        {actionUserId === user.id ? "Updating…" : "Logout"}
                      </button>
                    </td>
                    {userRole === "Admin" && (
                      <td className="border-b border-slate-100 p-4">
                        <button
                          onClick={() => deleteUser(user)}
                          disabled={user.email === userEmail || actionUserId === user.id}
                          className={`px-3 py-1 text-sm text-white rounded ${
                            user.email === userEmail
                              ? "bg-slate-200 cursor-not-allowed"
                              : "bg-rose-600 hover:bg-rose-700"
                          }`}
                        >
                          {actionUserId === user.id ? "Updating…" : "Delete"}
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
