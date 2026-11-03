import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { loginWithGoogle, sendOtp, verifyOtp } from "./api/authApi";
import { registerUser } from "./api/userApi";
import useCurrentUser from "./hooks/useCurrentUser";
import BrandMark from "./components/BrandMark";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "Kunal Kumar Soni",
    email: "kunalkumarsoni82@gmail.com",
    password: "ffff",
  });
  const [serverError, setServerError] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [otpError, setOtpError] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [countdown, setCountdown] = useState(0);

  const navigate = useNavigate();
  const { user, isLoading } = useCurrentUser();

  useEffect(() => {
    if (user) navigate("/drive", { replace: true });
  }, [user, navigate]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  if (isLoading || user) return <div className="min-h-screen bg-slate-50" />;

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "email") {
      setServerError("");
      setOtpError("");
      setOtpSent(false);
      setOtpVerified(false);
      setCountdown(0);
    }
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSendOtp = async () => {
    if (!formData.email) return setOtpError("Please enter your email first.");
    try {
      setIsSending(true);
      await sendOtp(formData.email);
      setOtpSent(true);
      setCountdown(60);
      setOtpError("");
    } catch (err) {
      setOtpError(err.response?.data?.error || "Failed to send OTP.");
    } finally {
      setIsSending(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp) return setOtpError("Please enter OTP.");
    try {
      setIsVerifying(true);
      await verifyOtp(formData.email, otp);
      setOtpVerified(true);
      setOtpError("");
    } catch (err) {
      setOtpError(err.response?.data?.error || "Invalid or expired OTP.");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!otpVerified) return setOtpError("Please verify your email with OTP.");
    try {
      setIsRegistering(true);
      await registerUser({ ...formData, otp });
      setIsSuccess(true);
      setTimeout(() => navigate("/drive"), 2000);
    } catch (err) {
      setServerError(err.response?.data?.error || "Something went wrong.");
    } finally {
      setIsRegistering(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top_right,#dbeafe,transparent_35%),linear-gradient(135deg,#f8fafc,#eef2ff)] p-4">
      <div className="w-full max-w-md rounded-3xl border border-white bg-white/90 p-6 shadow-2xl shadow-slate-300/60 backdrop-blur sm:p-8">
        <div className="mb-7 text-center">
          <BrandMark className="mx-auto h-11 w-11" />
          <p className="mt-4 text-xs font-bold uppercase tracking-[.2em] text-blue-600">
            Your space starts here
          </p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
            Create your account
          </h2>
          <p className="mt-2 text-sm text-slate-500">A secure home for your important files.</p>
        </div>
        <form className="flex flex-col" onSubmit={handleSubmit}>
          <div className="relative mb-3">
            <label className="mb-1.5 block text-sm font-semibold text-slate-700">Name</label>
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-200 px-3 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            />
          </div>

          <div className="relative mb-3">
            <label className="mb-1.5 block text-sm font-semibold text-slate-700">Email</label>
            <div className="relative">
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className={`w-full rounded-xl border px-3 py-3 pr-24 text-sm outline-none transition ${serverError ? "border-rose-400" : "border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"}`}
              />
              <button
                type="button"
                onClick={handleSendOtp}
                disabled={isSending || countdown > 0}
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg bg-blue-600 px-2 py-1.5 text-xs font-semibold text-white transition hover:bg-blue-700"
              >
                {isSending ? "Sending..." : countdown > 0 ? `${countdown}s` : "Send OTP"}
              </button>
            </div>
            {serverError && (
              <span className="mt-1.5 block text-xs font-medium text-rose-600">{serverError}</span>
            )}
          </div>

          {otpSent && (
            <div className="relative mb-3">
              <label className="mb-1.5 block text-sm font-semibold text-slate-700">Enter OTP</label>
              <div className="relative">
                <input
                  type="text"
                  maxLength={4}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-3 py-3 pr-24 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                />
                <button
                  type="button"
                  onClick={handleVerifyOtp}
                  disabled={isVerifying || otpVerified}
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg bg-blue-600 px-2 py-1.5 text-xs font-semibold text-white transition hover:bg-blue-700"
                >
                  {isVerifying ? "Verifying..." : otpVerified ? "Verified" : "Verify OTP"}
                </button>
              </div>
              {otpError && (
                <span className="mt-1.5 block text-xs font-medium text-rose-600">{otpError}</span>
              )}
            </div>
          )}

          <div className="relative mb-3">
            <label className="mb-1.5 block text-sm font-semibold text-slate-700">Password</label>
            <input
              type="password"
              name="password"
              required
              value={formData.password}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-200 px-3 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            />
          </div>

          <button
            type="submit"
            className={`mt-2 w-full rounded-xl bg-blue-600 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 ${!otpVerified || isSuccess || isRegistering ? "cursor-not-allowed opacity-60" : ""}`}
            disabled={!otpVerified || isSuccess || isRegistering}
          >
            {isSuccess
              ? "Registration Successful"
              : isRegistering
                ? "Creating account…"
                : "Register"}
          </button>
        </form>

        <p className="mt-5 text-center text-sm text-slate-600">
          Already have an account?{" "}
          <Link to="/login" className="font-semibold text-blue-600 hover:text-blue-700">
            Login
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
              const data = await loginWithGoogle(credentialResponse.credential);
              if (!data.error) navigate("/drive");
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

export default Register;
