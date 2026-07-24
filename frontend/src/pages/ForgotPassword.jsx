import { useState } from "react";
import { Link } from "react-router";
import { forgotPassword } from "../lib/api";
import toast from "react-hot-toast";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await forgotPassword(email);
      setSent(true);
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center px-4 bg-white dark:bg-gray-950">
      <div className="w-full max-w-md bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-8 border border-gray-100 dark:border-gray-800">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Reset your password</h2>
        {sent ? (
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            If an account exists for {email}, a reset link has been sent.
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            <input
              type="email"
              required
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none"
            />
            <button
              disabled={loading}
              className="w-full py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold disabled:opacity-50"
            >
              {loading ? "Sending..." : "Send reset link"}
            </button>
          </form>
        )}
        <Link to="/login" className="block text-center text-sm text-indigo-600 dark:text-indigo-400 mt-6 hover:underline">
          Back to login
        </Link>
      </div>
    </div>
  );
};
export default ForgotPasswordPage;