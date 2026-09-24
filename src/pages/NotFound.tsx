import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-bg-dark-secondary text-text-gray flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-2xl">
        <div className="bg-bg-card border border-border rounded-3xl shadow-[0_20px_60px_rgba(15,23,42,0.45)] overflow-hidden">
          <div className="h-2 bg-linear-to-r from-blue-500 via-cyan-400 to-violet-500" />

          <div className="p-8 sm:p-12 text-center">
            <div className="inline-flex items-center justify-center px-4 py-1 rounded-full border border-blue-500/20 bg-blue-500/10 text-blue-300 text-[10px] font-bold uppercase tracking-[0.22em]">
              404 Error
            </div>

            <div className="mt-6">
              <p className="text-7xl sm:text-8xl font-black tracking-[-0.08em] text-transparent bg-linear-to-r from-blue-400 via-cyan-300 to-violet-400 bg-clip-text">
                404
              </p>
            </div>

            <h1 className="mt-4 text-2xl sm:text-3xl font-bold text-text-white font-['Space_Grotesk']">
              Page not found
            </h1>

            <p className="mt-3 text-sm sm:text-base text-text-muted max-w-xl mx-auto leading-6">
              The page you’re looking for may have moved, been removed, or never existed.
              Let’s get you back to your VtuNova dashboard.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                to="/user/dashboard"
                className="inline-flex items-center justify-center rounded-xl bg-linear-to-r from-blue-600 to-cyan-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 hover:opacity-95 transition-opacity"
              >
                Go to dashboard
              </Link>
              <Link
                to="/"
                className="inline-flex items-center justify-center rounded-xl border border-border bg-bg-dark-secondary px-5 py-3 text-sm font-semibold text-text-white hover:border-border-hover transition-colors"
              >
                Back home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
