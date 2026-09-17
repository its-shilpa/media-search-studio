import { Link, useLocation } from "react-router-dom"
import { useSelector } from "react-redux"

const Navbar = () => {
  const location = useLocation()
  const collection = useSelector((state) => state.collection.items)
  const savedCount = collection ? collection.length : 0

  const isSearchActive = location.pathname === "/"
  const isCollectionActive = location.pathname === "/collection"

  return (
    <header className="sticky top-0 z-50 bg-[#090d16]/85 backdrop-blur-xl border-b border-white/[0.08] transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-8 py-3.5">
        <Link 
          to="/" 
          className="group flex items-center gap-2.5 text-white transition-opacity hover:opacity-90 flex-shrink-0"
        >
          {/* Refined media lens/aperture icon */}
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <svg 
              className="w-4 h-4 text-white" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2.5" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
            </svg>
          </div>
          <span className="text-base sm:text-lg font-semibold tracking-tight text-white whitespace-nowrap">
            Media<span className="text-indigo-400">Search</span>
          </span>
        </Link>

        <nav className="flex items-center gap-1.5 sm:gap-3">
          <Link
            to="/"
            className={`px-3 sm:px-4 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all duration-150 flex items-center gap-1.5 ${
              isSearchActive
                ? "bg-white/10 text-white shadow-inner font-semibold"
                : "text-slate-400 hover:text-white hover:bg-white/[0.05]"
            }`}
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            Search
          </Link>

          <Link
            to="/collection"
            className={`px-3 sm:px-4 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all duration-150 flex items-center gap-1.5 ${
              isCollectionActive
                ? "bg-white/10 text-white shadow-inner font-semibold"
                : "text-slate-400 hover:text-white hover:bg-white/[0.05]"
            }`}
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
            </svg>
            Collection
            {savedCount > 0 && (
              <span className="ml-0.5 px-1.5 py-0.2 text-[10px] sm:text-xs font-bold rounded-full bg-indigo-500/25 text-indigo-300 border border-indigo-500/40">
                {savedCount}
              </span>
            )}
          </Link>
        </nav>
      </div>
    </header>
  )
}

export default Navbar