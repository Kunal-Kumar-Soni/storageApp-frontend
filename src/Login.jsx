import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { loginWithGoogle } from "./api/authApi";
import { loginUser } from "./api/userApi";
import useCurrentUser from "./hooks/useCurrentUser";
import BrandMark from "./components/BrandMark";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "kunalkumarsoni82@gmail.com",
    password: "ffff",
  });
  const [serverError, setServerError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { user, isLoading } = useCurrentUser();

  useEffect(() => {
    if (user) navigate("/drive", { replace: true });
  }, [user, navigate]);

  if (isLoading || user) return <div className="min-h-screen bg-slate-50" />;

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (serverError) setServerError("");
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      const data = await loginUser(formData);
      if (data.error) setServerError(data.error);
      else navigate("/drive");
    } catch (err) {
      console.error("Login error:", err);
      setServerError(err.response?.data?.error || "Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const hasError = Boolean(serverError);

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top_left,#dbeafe,transparent_35%),linear-gradient(135deg,#f8fafc,#eef2ff)] p-4">
      <div className="w-full max-w-md rounded-3xl border border-white bg-white/90 p-6 shadow-2xl shadow-slate-300/60 backdrop-blur sm:p-8">
        <div className="mb-7 text-center">
          <BrandMark className="mx-auto h-11 w-11" />
          <p className="mt-4 text-xs font-bold uppercase tracking-[.2em] text-blue-600">
            Welcome back
          </p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
            Sign in to your storage
          </h2>
          <p className="mt-2 text-sm text-slate-500">Your files are ready when you are.</p>
        </div>
        <form className="flex flex-col" onSubmit={handleSubmit}>
          <div className="relative mb-3">
            <label htmlFor="email" className="mb-1.5 block text-sm font-semibold text-slate-700">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full rounded-xl border px-3 py-3 text-sm outline-none transition ${hasError ? "border-rose-400 ring-4 ring-rose-50" : "border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"}`}
            />
          </div>

          <div className="relative mb-3">
            <label htmlFor="password" className="mb-1.5 block text-sm font-semibold text-slate-700">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              className={`w-full rounded-xl border px-3 py-3 text-sm outline-none transition ${hasError ? "border-rose-400 ring-4 ring-rose-50" : "border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"}`}
            />
            {serverError && (
              <span className="mt-1.5 block text-xs font-medium text-rose-600">{serverError}</span>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-2 w-full rounded-xl bg-blue-600 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700"
          >
            {isSubmitting ? "Signing in…" : "Login"}
          </button>
        </form>

        <p className="mt-5 text-center text-sm text-slate-600">
          Don't have an account?{" "}
          <Link className="font-semibold text-blue-600 hover:text-blue-700" to="/register">
            Register
          </Link>
        </p>

        <div className="relative my-6 text-center">
          <div className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-slate-200"></div>
          <span className="relative bg-white px-3 text-xs font-medium text-slate-400">
            OR CONTINUE WITH
          </span>
        </div>

        <div className="flex justify-center">
          <GoogleLogin
            onSuccess={async (credentialResponse) => {
              try {
                const data = await loginWithGoogle(credentialResponse.credential);
                if (!data.error) navigate("/drive");
              } catch (err) {
                console.error("Google login failed:", err);
              }
            }}
            onError={() => console.log("Login Failed")}
            theme="filled_blue"
            text="continue_with"
            useOneTap
          />
        </div>
      </div>
    </div>
  );
};

export default Login;
