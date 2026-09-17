import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import CollectionCard from '../components/CollectionCard'
import { clearCollection } from '../redux/features/collectionSlice'

const CollectionPage = () => {
    const collection = useSelector(state => state.collection.items)
    const dispatch = useDispatch()
    const [confirmClear, setConfirmClear] = useState(false)

    const handleClear = () => {
        if (confirmClear) {
            dispatch(clearCollection())
            setConfirmClear(false)
        } else {
            setConfirmClear(true)
        }
    }

    // 1. Empty State
    if (!collection || collection.length === 0) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 flex flex-col items-center justify-center text-center min-h-[60vh]">
                <div className="w-16 h-16 rounded-3xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mb-5 shadow-xl shadow-indigo-500/5">
                    <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
                    </svg>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight mb-2">
                    Your collection is empty
                </h2>
                <p className="text-sm sm:text-base text-slate-400 max-w-sm mb-8 leading-relaxed">
                    Save your favorite high-resolution photos and 4K videos while exploring to build your personal library.
                </p>
                <Link
                    to="/"
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white text-sm font-semibold shadow-lg shadow-indigo-600/30 active:scale-95 transition-all"
                >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="11" cy="11" r="8"/>
                        <line x1="21" y1="21" x2="16.65" y2="16.65"/>
                    </svg>
                    <span>Discover Media</span>
                </Link>
            </div>
        )
    }

    // 2. Populated State
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 pb-16">
            {/* Header section with count and clear button */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-6 mb-8 border-b border-white/[0.08] gap-4">
                <div className="flex items-center gap-3">
                    <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                        Your Collection
                    </h1>
                    <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                        {collection.length} {collection.length === 1 ? 'item' : 'items'}
                    </span>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-auto">
                    {confirmClear ? (
                        <div className="flex items-center gap-2">
                            <span className="text-xs text-amber-300">Are you sure?</span>
                            <button
                                type="button"
                                onClick={handleClear}
                                className="px-3 py-1.5 bg-red-600 hover:bg-red-500 text-white text-xs font-semibold rounded-lg shadow-md active:scale-95 transition-all cursor-pointer"
                            >
                                Confirm Clear
                            </button>
                            <button
                                type="button"
                                onClick={() => setConfirmClear(false)}
                                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-lg active:scale-95 transition-all cursor-pointer"
                            >
                                Cancel
                            </button>
                        </div>
                    ) : (
                        <button
                            type="button"
                            onClick={handleClear}
                            className="px-3.5 py-1.5 rounded-xl border border-red-500/30 text-red-300 hover:bg-red-500/10 hover:border-red-500/50 text-xs sm:text-sm font-medium transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer"
                        >
                            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="3 6 5 6 21 6"/>
                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                            </svg>
                            <span>Clear Collection</span>
                        </button>
                    )}
                </div>
            </div>

            {/* Collection Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6">
                {collection.map((item) => (
                    <CollectionCard key={item.id} item={item} />
                ))}
            </div>
        </div>
    )
}

export default CollectionPage