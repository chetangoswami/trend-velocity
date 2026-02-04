export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-zinc-900 via-zinc-800 to-black p-8 font-sans">
      <main className="flex flex-col items-center gap-8 text-center">
        {/* Logo/Title Section */}
        <div className="space-y-4">
          <h1 className="bg-gradient-to-r from-amber-400 via-orange-500 to-rose-500 bg-clip-text text-6xl font-bold tracking-tight text-transparent sm:text-7xl">
            Trend Velocity
          </h1>
          <p className="text-xl text-zinc-400">
            Where Jewelry Meets the Moment
          </p>
        </div>

        {/* Status Badge */}
        <div className="flex items-center gap-2 rounded-full bg-zinc-800/80 px-4 py-2 backdrop-blur-sm">
          <span className="relative flex h-3 w-3">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex h-3 w-3 rounded-full bg-emerald-500"></span>
          </span>
          <span className="text-sm text-zinc-300">Store Coming Soon</span>
        </div>

        {/* Quick Links */}
        <div className="mt-8 flex flex-col gap-4 sm:flex-row">
          <a
            href="/products"
            className="group flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-amber-500 to-orange-600 px-6 py-3 text-sm font-medium text-white transition-all hover:from-amber-400 hover:to-orange-500 hover:shadow-lg hover:shadow-orange-500/25"
          >
            Browse Collection
            <svg
              className="h-4 w-4 transition-transform group-hover:translate-x-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </a>
          <a
            href="/dashboard"
            className="flex items-center justify-center gap-2 rounded-full border border-zinc-700 px-6 py-3 text-sm font-medium text-zinc-300 transition-all hover:border-zinc-500 hover:bg-zinc-800/50"
          >
            Admin Dashboard
          </a>
        </div>

        {/* Tech Stack Footer */}
        <div className="mt-16 text-xs text-zinc-600">
          Powered by Next.js • Medusa • Sanity
        </div>
      </main>
    </div>
  );
}
