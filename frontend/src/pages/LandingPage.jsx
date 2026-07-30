import { Link } from "react-router";
import { ShipWheelIcon, MessageCircleIcon, VideoIcon, UsersIcon, GlobeIcon, ZapIcon, SunIcon, MoonIcon } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

const LandingPage = () => {
  const { theme, toggleTheme } = useTheme();

  const features = [
    {
      icon: <UsersIcon className="size-6 text-indigo-600" />,
      title: "Find Language Partners",
      desc: "Match with people learning your native language and speaking the one you want to learn.",
    },
    {
      icon: <MessageCircleIcon className="size-6 text-indigo-600" />,
      title: "Real-time Chat",
      desc: "Message instantly with typing indicators, read receipts, and online presence.",
    },
    {
      icon: <VideoIcon className="size-6 text-indigo-600" />,
      title: "Video & Voice Calls",
      desc: "Practice speaking live with crystal-clear video calls, one click away.",
    },
    {
      icon: <GlobeIcon className="size-6 text-indigo-600" />,
      title: "Global Community",
      desc: "Connect with learners and native speakers from around the world.",
    },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 transition-colors">
      {/* Nav */}
      <nav className="container mx-auto px-4 sm:px-6 py-4 sm:py-6 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
          <ShipWheelIcon className="size-6 sm:size-8 text-indigo-600 flex-shrink-0" />
          <span className="text-base sm:text-2xl font-bold tracking-wide bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-500 truncate">
            Konvoo
          </span>
        </div>
        <div className="flex items-center gap-1.5 sm:gap-3 flex-shrink-0">
          <button
            onClick={toggleTheme}
            className="p-1.5 sm:p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition"
            aria-label="Toggle theme"
          >
            {theme === "light" ? (
              <MoonIcon className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600" />
            ) : (
              <SunIcon className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-400" />
            )}
          </button>
          <Link
            to="/login"
            className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-indigo-600 whitespace-nowrap px-1"
          >
            Sign in
          </Link>
          <Link
            to="/signup"
            className="px-3 sm:px-5 py-1.5 sm:py-2 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-xs sm:text-sm font-semibold hover:opacity-90 transition whitespace-nowrap"
          >
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="container mx-auto px-6 py-16 sm:py-24 text-center">
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-300 text-xs font-semibold mb-6">
          <ZapIcon className="size-3" /> Free forever, no ads
        </span>
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-6 max-w-3xl mx-auto">
          Learn languages by{" "}
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
            talking to real people
          </span>
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-xl mx-auto mb-10">
          Connect with language exchange partners worldwide. Chat, call, and practice
          together — no textbooks required.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/signup"
            className="w-full sm:w-auto px-8 py-3 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold shadow-lg hover:opacity-90 hover:scale-[1.02] transition"
          >
            Start Learning Free
          </Link>
          <Link
            to="/login"
            className="w-full sm:w-auto px-8 py-3 rounded-full border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-semibold hover:bg-gray-50 dark:hover:bg-gray-900 transition"
          >
            Sign In
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f) => (
            <div
              key={f.title}
              className="p-6 rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 hover:shadow-lg transition-shadow"
            >
              <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-950 flex items-center justify-center mb-4">
                {f.icon}
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{f.title}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-6 py-16 text-center">
        <div className="rounded-3xl bg-gradient-to-r from-indigo-600 to-purple-600 p-12 sm:p-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Ready to start your language journey?
          </h2>
          <p className="text-indigo-100 mb-8 max-w-md mx-auto">
            Join thousands of learners practicing conversations every day.
          </p>
          <Link
            to="/signup"
            className="inline-block px-8 py-3 rounded-full bg-white text-indigo-600 font-semibold hover:opacity-90 transition"
          >
            Create Free Account
          </Link>
        </div>
      </section>

      <footer className="container mx-auto px-6 py-8 text-center text-sm text-gray-500 dark:text-gray-600">
        © {new Date().getFullYear()} Konvoo. Built for language learners everywhere.
      </footer>
    </div>
  );
};

export default LandingPage;