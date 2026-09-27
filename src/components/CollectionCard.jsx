import React, { useState, useRef } from 'react'
import { useDispatch } from 'react-redux'
import { removeCollection, removeToast } from '../redux/features/collectionSlice'

const CollectionCard = ({ item }) => {
    const dispatch = useDispatch()
    const videoRef = useRef(null)
    const [isHovered, setIsHovered] = useState(false)

    const [isDownloading, setIsDownloading] = useState(false)

    const ext = item.type === 'video' ? 'mp4' : item.type === 'gif' ? 'gif' : 'jpg'
    const cleanTitle = (item.title || item.type || 'media')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '')
        .slice(0, 30) || 'media-download'
    const filename = `${cleanTitle}.${ext}`

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

    const handleDownload = async (e) => {
        e.preventDefault()
        e.stopPropagation()
        if (isDownloading) return

        setIsDownloading(true)
        try {
            const res = await fetch(item.src)
            const blob = await res.blob()
            const blobUrl = window.URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = blobUrl
            a.download = filename
            document.body.appendChild(a)
            a.click()
            document.body.removeChild(a)
            window.URL.revokeObjectURL(blobUrl)
        } catch {
            // Fallback: trigger direct link if blob fetch fails
            const a = document.createElement('a')
            a.href = item.src
            a.download = filename
            a.target = '_blank'
            document.body.appendChild(a)
            a.click()
            document.body.removeChild(a)
        } finally {
            setIsDownloading(false)
        }
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
            </a>

            {/* Bottom Scrim with Meta and Actions */}
            <div className="absolute inset-x-0 bottom-0 pt-16 pb-3 px-3.5 bg-gradient-to-t from-slate-950/95 via-slate-950/60 to-transparent flex items-end justify-between gap-2 pointer-events-none">
                <h3 
                    className="text-xs sm:text-sm font-medium text-white/95 capitalize truncate flex-1 drop-shadow-sm pointer-events-auto"
                    title={displayTitle}
                >
                    {displayTitle}
                </h3>

                {/* Action Buttons */}
                <div className="flex items-center gap-1.5 flex-shrink-0 pointer-events-auto">
                    {/* Direct Download Link */}
                    <a
                        href={item.src}
                        download={filename}
                        onClick={handleDownload}
                        target="_blank"
                        rel="noreferrer"
                        title={`Download ${item.type}`}
                        className="px-2.5 py-1 bg-white/10 hover:bg-white/20 active:scale-95 text-white text-xs font-semibold rounded-lg shadow-sm border border-white/15 backdrop-blur-md transition-all duration-150 flex items-center gap-1 cursor-pointer"
                    >
                        {isDownloading ? (
                            <svg className="w-3.5 h-3.5 animate-spin text-indigo-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                            </svg>
                        ) : (
                            <svg className="w-3.5 h-3.5 text-slate-200" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                                <polyline points="7 10 12 15 17 10"/>
                                <line x1="12" y1="15" x2="12" y2="3"/>
                            </svg>
                        )}
                        <span className="hidden sm:inline">Download</span>
                    </a>

                    {/* Remove from collection */}
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
            </div>
        </div>
    )
}

export default CollectionCard