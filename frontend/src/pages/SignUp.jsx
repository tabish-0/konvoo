import { useState } from "react";
import { ShipWheelIcon } from "lucide-react";
import { Link } from "react-router";

import useSignUp from "../hooks/useSignUp";

const SignUpPage = () => {
  const [signupData, setSignupData] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  const { isPending, error, signupMutation } = useSignUp();

  const handleSignup = (e) => {
    e.preventDefault();
    signupMutation(signupData);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-gray-100 to-gray-200 relative overflow-hidden">
      <div className="w-full max-w-5xl mx-auto rounded-2xl shadow-xl overflow-hidden grid lg:grid-cols-2 border border-gray-200 bg-white">
        {/* LEFT SIDE - SIGNUP FORM */}
        <div className="p-8 sm:p-10 flex flex-col justify-center">
          {/* Logo */}
          <div className="flex items-center gap-2 mb-6">
            <ShipWheelIcon className="size-8 text-indigo-500 drop-shadow-sm" />
            <span className="text-3xl font-bold font-mono bg-gradient-to-r from-indigo-500 to-blue-400 bg-clip-text text-transparent tracking-wide">
              Konvoo
            </span>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 rounded-md bg-red-50 border border-red-200 text-red-600 text-sm">
              {error.response?.data?.message || "Something went wrong"}
            </div>
          )}

          {/* Signup Form */}
          <form onSubmit={handleSignup} className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                Create your account
              </h2>
              <p className="text-sm text-gray-500">
                Start your language learning journey today 🚀
              </p>
            </div>

            <div className="space-y-4">
              {/* FULL NAME */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  placeholder="John Doe"
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
                  value={signupData.fullName}
                  onChange={(e) =>
                    setSignupData({ ...signupData, fullName: e.target.value })
                  }
                  required
                />
              </div>

              {/* EMAIL */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="john@gmail.com"
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
                  value={signupData.email}
                  onChange={(e) =>
                    setSignupData({ ...signupData, email: e.target.value })
                  }
                  required
                />
              </div>

              {/* PASSWORD */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
                  value={signupData.password}
                  onChange={(e) =>
                    setSignupData({ ...signupData, password: e.target.value })
                  }
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  Must be at least 6 characters long
                </p>
              </div>

              {/* TERMS */}
              <label className="flex items-center gap-2 text-xs text-gray-600 cursor-pointer">
                <input
                  type="checkbox"
                  className="h-4 w-4 accent-indigo-500 rounded"
                  required
                />
                <span>
                  I agree to the{" "}
                  <span className="text-indigo-500 hover:underline">terms</span>{" "}
                  &{" "}
                  <span className="text-indigo-500 hover:underline">
                    privacy policy
                  </span>
                </span>
              </label>
            </div>

            {/* SUBMIT BUTTON */}
            <button
              className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-blue-500 text-white font-semibold shadow-md hover:scale-[1.01] active:scale-95 transition-transform"
              type="submit"
            >
              {isPending ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
                  Creating...
                </span>
              ) : (
                "Create Account"
              )}
            </button>

            {/* LOGIN LINK */}
            <p className="text-center text-sm mt-3 text-gray-600">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-indigo-500 hover:underline font-medium"
              >
                Sign in
              </Link>
            </p>
          </form>
        </div>

        {/* RIGHT SIDE - Illustration */}
        <div className="hidden lg:flex bg-gradient-to-br from-gray-50 to-gray-100 items-center justify-center p-10">
          <div className="text-center max-w-md">
            <img
              src="/i.png"
              alt="Language illustration"
              className="w-72 mx-auto"
            />
            <h2 className="text-xl font-bold mt-6 text-gray-800">
              Connect with partners worldwide
            </h2>
            <p className="text-gray-600 mt-2">
              Practice conversations, make friends, and improve your skills with
              real people ✨
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
