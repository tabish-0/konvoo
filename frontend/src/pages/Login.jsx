import { useState } from "react";
import { ShipWheelIcon, Loader2 } from "lucide-react";
import { Link } from "react-router";
import useLogin from "../hooks/useLogin";

const LoginPage = () => {
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const { isPending, error, loginMutation } = useLogin();

  const handleLogin = (e) => {
    e.preventDefault();
    loginMutation(loginData);
  };

  return (
    <div className="h-screen flex items-center justify-center px-4 sm:px-6 md:px-8 bg-white dark:bg-gray-950 transition-colors">
      <div className="flex flex-col md:flex-row w-full max-w-5xl bg-white/90 dark:bg-gray-900/90 backdrop-blur-lg rounded-2xl shadow-2xl overflow-hidden border border-white/20 dark:border-gray-800">
        <div className="w-full md:w-1/2 p-6 sm:p-10 flex flex-col justify-center">
          <div className="mb-8 flex items-center gap-2">
            <ShipWheelIcon className="w-10 h-10 text-blue-600" />
            <span className="text-3xl font-extrabold font-mono bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-indigo-500 tracking-wide">
              Streamify
            </span>
          </div>

          {error && (
            <div className="w-full bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300 border border-red-300 dark:border-red-800 text-sm px-4 py-2 rounded-md mb-4">
              {error.response?.data?.message || "Something went wrong"}
            </div>
          )}

          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Welcome Back</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">Sign in to continue your language journey</p>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
              <input
                type="email"
                placeholder="hello@example.com"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
                value={loginData.email}
                onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Password</label>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
                value={loginData.password}
                onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                required
              />
            </div>
            <button
              type="submit"
              disabled={isPending}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-semibold rounded-lg shadow-md hover:opacity-90 transition disabled:opacity-50"
            >
              {isPending ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" /> Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          <div className="text-right mt-2">
            <Link to="/forgot-password" className="text-xs text-blue-600 dark:text-blue-400 hover:underline">
              Forgot password?
            </Link>
          </div>

          <div className="text-center mt-6 text-sm text-gray-700 dark:text-gray-300">
            Don't have an account?{" "}
            <Link to="/signup" className="text-blue-600 dark:text-blue-400 font-medium hover:underline">
              Create one
            </Link>
          </div>
        </div>

        <div className="hidden md:flex w-full md:w-1/2 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 items-center justify-center">
          <div className="max-w-md p-10 text-center">
            <img src="/i.png" alt="Language connection illustration" className="w-full h-auto drop-shadow-xl" />
            <h2 className="text-xl font-semibold mt-6 text-gray-800 dark:text-gray-100">
              Connect with language partners worldwide
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
              Practice conversations, make friends, and improve your language skills together.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;