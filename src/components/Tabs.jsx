import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setActiveTabs } from '../redux/features/searchSlice'

const Tabs = () => {
    const tabs = [
        {
            id: 'all',
            label: 'All',
            icon: (
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="7" height="7" rx="1.5" />
                    <rect x="14" y="3" width="7" height="7" rx="1.5" />
                    <rect x="14" y="14" width="7" height="7" rx="1.5" />
                    <rect x="3" y="14" width="7" height="7" rx="1.5" />
                </svg>
            )
        },
        { 
            id: 'photos', 
            label: 'Photos', 
            icon: (
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                    <circle cx="8.5" cy="8.5" r="1.5"/>
                    <polyline points="21 15 16 10 5 21"/>
                </svg>
            )
        },
        { 
            id: 'videos', 
            label: 'Videos', 
            icon: (
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="23 7 16 12 23 17 23 7"/>
                    <rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>
                </svg>
            )
        },
        { 
            id: 'gifs', 
            label: 'GIFs', 
            icon: (
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2"/>
              <circle cx="8.5" cy="8.5" r="1.5"/>
              <path d="M21 15l-5-5L5 21"/>
            </svg>
            )
        }
    ]

    const dispatch = useDispatch()
    const activeTab = useSelector((state) => state.search.activeTab)
    const query = useSelector((state) => state.search.query)

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            {/* Context Headline */}
            <div className="flex items-baseline gap-2">
                <h2 className="text-base sm:text-lg font-semibold text-white tracking-tight">
                    Results for <span className="text-indigo-400 capitalize">"{query}"</span>
                </h2>
            </div>

            {/* Segmented Control */}
            <div className="inline-flex self-start sm:self-auto p-1 rounded-xl bg-slate-900/90 border border-white/10 shadow-inner">
                {tabs.map((tab) => {
                    const isActive = activeTab === tab.id
                    return (
                        <button
                            key={tab.id}
                            onClick={() => dispatch(setActiveTabs(tab.id))}
                            className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all duration-150 cursor-pointer active:scale-95 ${
                                isActive
                                    ? "bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-600/30 font-semibold"
                                    : "text-slate-400 hover:text-white hover:bg-white/[0.04]"
                            }`}
                        >
                            {tab.icon}
                            <span>{tab.label}</span>
                        </button>
                    )
                })}
            </div>
        </div>
    )
}

export default Tabs