import { useSelector, useDispatch } from "react-redux"
import ResultGrid from "../components/ResultGrid"
import SearchBar from "../components/SearchBar"
import Tabs from "../components/Tabs"
import { setQuery } from "../redux/features/searchSlice"

const CURATED_CATEGORIES = [
  {
    title: "Mountain Landscapes",
    query: "mountains",
    desc: "Dramatic peaks, foggy ridges, and alpine vistas",
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="3 20 9 8 13 14 16 10 21 20 3 20"/>
      </svg>
    )
  },
  {
    title: "Urban Architecture",
    query: "architecture",
    desc: "Clean geometric lines, glass facades, and cityscapes",
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="20" x2="18" y2="10"/>
        <line x1="12" y1="20" x2="12" y2="4"/>
        <line x1="6" y1="20" x2="6" y2="14"/>
      </svg>
    )
  },
  {
    title: "Ocean & Waterfalls",
    query: "ocean",
    desc: "Crashing waves, azure water, and cascading falls",
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 12c3.5-5 8.5-5 12 0 3.5-5 8.5-5 12 0"/>
      </svg>
    )
  },
  {
    title: "Minimalist & Textures",
    query: "minimal",
    desc: "Muted tones, clean negative space, and serene patterns",
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <line x1="14.31" y1="8" x2="20.05" y2="17.94"/>
        <line x1="9.69" y1="8" x2="21.17" y2="8"/>
        <line x1="7.38" y1="12" x2="13.12" y2="2.06"/>
      </svg>
    )
  }
]

const Homepage = () => {
    const { query } = useSelector((store) => store.search)
    const dispatch = useDispatch()

    return (
        <div className="w-full">
            <SearchBar />
            {query ? (
                <div className="animate-fadeIn">
                    <Tabs />
                    <ResultGrid />
                </div>
            ) : (
                /* Initial Welcome / Discovery Hero */
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
                    <div className="text-center max-w-2xl mx-auto mb-12">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold mb-4">
                            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
                            Unified Media Search
                        </div>
                        <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight mb-3">
                            Discover High-Resolution <br className="hidden sm:inline" />
                            <span className="bg-gradient-to-r from-indigo-400 via-violet-300 to-purple-400 bg-clip-text text-transparent">
                                Photos & 4K Videos
                            </span>
                        </h1>
                        <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
                            Search millions of royalty-free creative assets from Unsplash and Pexels. Save your favorites directly to your collection.
                        </p>
                    </div>

                    {/* Curated Explore Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
                        {CURATED_CATEGORIES.map((cat) => (
                            <button
                                key={cat.query}
                                type="button"
                                onClick={() => dispatch(setQuery(cat.query))}
                                className="group text-left p-5 rounded-2xl bg-slate-900/60 hover:bg-slate-900/90 border border-white/[0.06] hover:border-indigo-500/40 transition-all duration-200 cursor-pointer shadow-lg shadow-black/20 hover:shadow-indigo-500/5 active:scale-[0.98]"
                            >
                                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 group-hover:bg-indigo-500/20 text-indigo-400 flex items-center justify-center mb-3.5 transition-colors">
                                    {cat.icon}
                                </div>
                                <h2 className="text-sm sm:text-base font-semibold text-white group-hover:text-indigo-300 transition-colors mb-1">
                                    {cat.title}
                                </h2>
                                <p className="text-xs text-slate-400 leading-relaxed">
                                    {cat.desc}
                                </p>
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}

export default Homepage