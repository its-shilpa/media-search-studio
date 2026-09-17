import React, { useState, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setQuery } from '../redux/features/searchSlice'

const TRENDING_SUGGESTIONS = ['Nature', 'Architecture', 'Minimal', 'Ocean', 'Wildlife', 'Cyberpunk', 'Space']

const ALL_SUGGESTIONS = [
    'Nature', 'Mountains', 'Ocean', 'Architecture', 'Minimal',
    'Cyberpunk', 'Space', 'Wildlife', 'Cityscape', 'Abstract',
    'Technology', 'Anime', 'Wallpaper', 'Animals', 'Sunset',
    'Coffee', 'Travel', 'Fitness', 'Flowers', 'Retro', 'Cars'
]

const SearchBar = () => {
    const currentQuery = useSelector((state) => state.search.query)
    const [text, setText] = useState(currentQuery || '')
    const [isFocused, setIsFocused] = useState(false)
    const containerRef = useRef(null)
    const dispatch = useDispatch()

    // 1. Debounced search-as-you-type (~500ms)
    useEffect(() => {
        const trimmed = text.trim()
        if (trimmed === currentQuery) return

        const timer = setTimeout(() => {
            dispatch(setQuery(trimmed))
        }, 500)

        return () => clearTimeout(timer)
    }, [text, currentQuery, dispatch])

    // 2. Sync text when currentQuery updates externally (e.g. hero categories)
    useEffect(() => {
        if (currentQuery !== text) {
            setText(currentQuery)
        }
    }, [currentQuery])

    // 3. Dismiss dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (containerRef.current && !containerRef.current.contains(e.target)) {
                setIsFocused(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const submitHandler = (e) => {
        e.preventDefault()
        setIsFocused(false)
        const trimmed = text.trim()
        if (trimmed !== currentQuery) {
            dispatch(setQuery(trimmed))
        }
    }

    const handleSelectSuggestion = (tag) => {
        setText(tag)
        setIsFocused(false)
        dispatch(setQuery(tag))
    }

    const handleClear = () => {
        setText('')
        dispatch(setQuery(''))
    }

    // Filter matching suggestions for autocomplete dropdown
    const filteredSuggestions = text.trim()
        ? ALL_SUGGESTIONS.filter((item) =>
            item.toLowerCase().includes(text.toLowerCase().trim()) &&
            item.toLowerCase() !== text.toLowerCase().trim()
        ).slice(0, 5)
        : []

    return (
        <div className="relative pt-8 pb-6 px-4 sm:px-6 lg:px-8 border-b border-white/[0.06] bg-gradient-to-b from-indigo-950/25 via-slate-900/10 to-transparent">
            <div ref={containerRef} className="max-w-3xl mx-auto flex flex-col items-center relative">
                <form 
                    onSubmit={submitHandler}
                    className="w-full relative flex items-center bg-slate-900/90 border border-white/10 rounded-2xl shadow-xl shadow-black/40 focus-within:border-indigo-500/70 focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all duration-200"
                >
                    {/* Search Lens Icon */}
                    <div className="pl-4 text-slate-400 flex items-center pointer-events-none">
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="11" cy="11" r="8"></circle>
                            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                        </svg>
                    </div>

                    {/* Input Field with search-as-you-type */}
                    <input
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        onFocus={() => setIsFocused(true)}
                        type="text"
                        placeholder="Search photos, videos & GIFs..."
                        className="w-full bg-transparent text-white placeholder:text-slate-400 pl-3 pr-28 sm:pr-32 py-3.5 sm:py-4 text-sm sm:text-base outline-none font-normal"
                        autoComplete="off"
                    />

                    {/* Clear Button */}
                    {text && (
                        <button
                            type="button"
                            onClick={handleClear}
                            aria-label="Clear search"
                            className="absolute right-24 sm:right-28 p-1.5 text-slate-400 hover:text-white transition-colors cursor-pointer rounded-full hover:bg-white/10"
                        >
                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                        </button>
                    )}

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="absolute right-1.5 top-1.5 bottom-1.5 px-4 sm:px-6 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-md shadow-indigo-600/30 active:scale-[0.97] transition-all flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap"
                    >
                        <span>Search</span>
                    </button>
                </form>

                {/* Suggestions Dropdown */}
                {isFocused && filteredSuggestions.length > 0 && (
                    <div className="absolute top-[58px] sm:top-[64px] left-0 right-0 py-2 bg-slate-900/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl shadow-black/80 z-50 overflow-hidden animate-fadeIn">
                        <div className="px-3.5 py-1 text-[11px] font-semibold tracking-wider text-slate-400 uppercase flex items-center justify-between border-b border-white/[0.06] mb-1">
                            <span>Suggestions</span>
                            <span className="text-[10px] text-indigo-400">Search-as-you-type</span>
                        </div>
                        {filteredSuggestions.map((suggestion) => (
                            <button
                                key={suggestion}
                                type="button"
                                onMouseDown={() => handleSelectSuggestion(suggestion)}
                                className="w-full px-3.5 py-2 text-left text-sm text-slate-200 hover:text-white hover:bg-indigo-600/20 flex items-center justify-between group transition-colors cursor-pointer"
                            >
                                <div className="flex items-center gap-2.5">
                                    <svg className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-400 transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <circle cx="11" cy="11" r="8"></circle>
                                        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                                    </svg>
                                    <span>{suggestion}</span>
                                </div>
                                <span className="text-xs text-slate-400 group-hover:text-indigo-300 transition-colors">Select</span>
                            </button>
                        ))}
                    </div>
                )}

                {/* Quick Trending Suggestions */}
                <div className="w-full mt-3.5 flex items-center justify-start sm:justify-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                    <span className="text-xs font-medium text-slate-400 whitespace-nowrap flex-shrink-0">
                        Trending:
                    </span>
                    {TRENDING_SUGGESTIONS.map((tag) => (
                        <button
                            key={tag}
                            type="button"
                            onClick={() => handleSelectSuggestion(tag)}
                            className={`text-xs px-2.5 py-1 rounded-full border transition-all cursor-pointer whitespace-nowrap flex-shrink-0 ${
                                currentQuery?.toLowerCase() === tag.toLowerCase()
                                    ? "bg-indigo-600/30 text-indigo-300 border-indigo-500/50 font-medium"
                                    : "bg-white/[0.04] text-slate-300 border-white/[0.08] hover:bg-white/[0.08] hover:text-white hover:border-white/20"
                            }`}
                        >
                            {tag}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default SearchBar