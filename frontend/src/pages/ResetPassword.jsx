import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import { resetPassword } from "../lib/api";
import toast from "react-hot-toast";

const ResetPasswordPage = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await resetPassword(token, password);
      toast.success("Password reset! Please log in.");
      navigate("/login");
    } catch (err) {
      toast.error(err.response?.data?.message || "Reset link invalid or expired");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center px-4 bg-white dark:bg-gray-950">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-8 border border-gray-100 dark:border-gray-800 space-y-4"
      >
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Set a new password</h2>
        <input
          type="password"
          required
          minLength={6}
          placeholder="New password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none"
        />
        <button
          disabled={loading}
          className="w-full py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold disabled:opacity-50"
        >
          {loading ? "Resetting..." : "Reset password"}
        </button>
      </form>
    </div>
  );
};
export default ResetPasswordPage;