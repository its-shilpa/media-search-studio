import React, { useState, useRef } from 'react'
import { useDispatch } from 'react-redux'
import { removeCollection, removeToast } from '../redux/features/collectionSlice'

const CollectionCard = ({ item }) => {
    const dispatch = useDispatch()
    const videoRef = useRef(null)
    const [isHovered, setIsHovered] = useState(false)

    const handleMouseEnter = () => {
        setIsHovered(true)
        if (item.type === 'video' && videoRef.current) {
            videoRef.current.play().catch(() => {})
        }
    }

    const handleMouseLeave = () => {
        setIsHovered(false)
        if (item.type === 'video' && videoRef.current) {
            videoRef.current.pause()
            videoRef.current.currentTime = 0
        }
    }

    const removeFromCollection = (e) => {
        e.preventDefault()
        e.stopPropagation()
        dispatch(removeCollection(item.id))
        dispatch(removeToast())
    }

    const displayTitle = item.title || (item.type === 'video' ? 'Untitled Video' : item.type === 'gif' ? 'Untitled GIF' : 'Untitled Photo')

    return (
        <div 
            className="group relative aspect-[4/3] w-full rounded-2xl overflow-hidden bg-slate-900 border border-white/[0.08] hover:border-white/20 transition-all duration-300 hover:shadow-2xl hover:shadow-black/60"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            {/* Media Anchor Link */}
            <a 
                target="_blank" 
                rel="noreferrer" 
                href={item.url} 
                className="block w-full h-full cursor-pointer relative"
                title={`View on original platform: ${displayTitle}`}
            >
                {/* Poster / Image Display */}
                <img 
                    className={`h-full w-full object-center object-cover transition-transform duration-500 ease-out group-hover:scale-105 ${
                        item.type === 'video' && isHovered ? 'opacity-0' : 'opacity-100'
                    }`} 
                    src={item.type === 'video' ? item.thumbnail : item.src} 
                    alt={displayTitle}
                    loading="lazy"
                />

                {/* Video Preview: Plays smoothly ONLY on hover */}
                {item.type === 'video' && (
                    <video 
                        ref={videoRef}
                        className={`absolute inset-0 h-full w-full object-center object-cover transition-opacity duration-300 ${
                            isHovered ? 'opacity-100' : 'opacity-0 pointer-events-none'
                        }`} 
                        loop 
                        muted 
                        playsInline
                        preload="none"
                        src={item.src} 
                    />
                )}

                {/* Media Type Badges */}
                {item.type === 'video' && (
                    <div className="absolute top-3 left-3 px-2 py-1 rounded-md bg-black/60 backdrop-blur-md text-[11px] font-semibold tracking-wider text-white/90 border border-white/10 flex items-center gap-1.5 shadow-sm">
                        <svg className="w-3 h-3 text-indigo-400" viewBox="0 0 24 24" fill="currentColor">
                            <polygon points="5 3 19 12 5 21 5"/>
                        </svg>
                        <span>VIDEO</span>
                    </div>
                )}

                {item.type === 'gif' && (
                    <div className="absolute top-3 left-3 px-2 py-1 rounded-md bg-black/60 backdrop-blur-md text-[11px] font-semibold tracking-wider text-pink-300 border border-pink-500/20 flex items-center gap-1.5 shadow-sm">
                        <svg className="w-3 h-3 text-pink-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="3" y="3" width="18" height="18" rx="2"/>
                            <circle cx="8.5" cy="8.5" r="1.5"/>
                            <path d="M21 15l-5-5L5 21"/>
                        </svg>
                        <span>GIF</span>
                    </div>
                )}

                {item.type === 'photo' && (
                    <div className="absolute top-3 left-3 px-2 py-1 rounded-md bg-black/60 backdrop-blur-md text-[11px] font-semibold tracking-wider text-sky-300 border border-sky-500/20 flex items-center gap-1.5 shadow-sm">
                        <svg className="w-3 h-3 text-sky-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                            <circle cx="8.5" cy="8.5" r="1.5"/>
                            <polyline points="21 15 16 10 5 21"/>
                        </svg>
                        <span>PHOTO</span>
                    </div>
                )}

                {/* External Link Icon */}
                <div className="absolute top-3 right-3 p-1.5 rounded-lg bg-black/50 backdrop-blur-md text-white/70 opacity-0 group-hover:opacity-100 hover:text-white hover:bg-black/80 transition-all duration-200 border border-white/10">
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                        <polyline points="15 3 21 3 21 9"></polyline>
                        <line x1="10" y1="14" x2="21" y2="3"></line>
                    </svg>
                </div>

                {/* Bottom Scrim with Meta and Remove Action */}
                <div className="absolute inset-x-0 bottom-0 pt-16 pb-3.5 px-4 bg-gradient-to-t from-slate-950/95 via-slate-950/60 to-transparent flex items-end justify-between gap-3">
                    <h3 
                        className="text-xs sm:text-sm font-medium text-white/95 capitalize truncate flex-1 drop-shadow-sm"
                        title={displayTitle}
                    >
                        {displayTitle}
                    </h3>

                    <button 
                        type="button"
                        onClick={removeFromCollection}
                        className="flex-shrink-0 px-2.5 py-1 bg-red-500/15 hover:bg-red-500/25 text-red-300 hover:text-red-200 border border-red-500/30 hover:border-red-500/40 text-xs font-semibold rounded-lg shadow-sm active:scale-95 transition-all duration-150 flex items-center gap-1 cursor-pointer"
                        title="Remove from collection"
                    >
                        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="3 6 5 6 21 6"/>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                        </svg>
                        <span>Remove</span>
                    </button>
                </div>
            </a>
        </div>
    )
}

export default CollectionCard