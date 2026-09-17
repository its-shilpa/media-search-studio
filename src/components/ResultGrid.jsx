import { useDispatch, useSelector } from 'react-redux'
import { fetchPhotos, fetchVideos } from '../api/mediaApi'
import { setLoading, setResults, setError } from '../redux/features/searchSlice'
import { useEffect } from 'react'
import ResultCard from './ResultCard'

const ResultGrid = () => {
    const dispatch = useDispatch()
    const { query, activeTab, results, loading, error } = useSelector((store) => store.search)

    useEffect(() => {
        if (!query) return
        const getData = async () => {
            try {
                dispatch(setLoading())
                let data = []

                if (activeTab === 'photos') {
                    const response = await fetchPhotos(query)
                    data = (response.results || []).map((item) => ({
                        id: item.id,
                        type: 'photo',
                        title: item.alt_description || item.description || 'Photo',
                        thumbnail: item.urls.small,
                        src: item.urls.regular || item.urls.full,
                        url: item.links.html
                    }))
                }
                if (activeTab === 'videos') {
                    const response = await fetchVideos(query)
                    data = (response.videos || []).map((item) => ({
                        id: item.id,
                        type: 'video',
                        title: item.user?.name ? `Video by ${item.user.name}` : 'Video',
                        thumbnail: item.image,
                        src: item.video_files?.[0]?.link || '',
                        url: item.url
                    }))
                }

                dispatch(setResults(data))
            } catch (err) {
                dispatch(setError(err.message || 'Failed to fetch media'))
            }
        }

        getData()
    }, [query, activeTab, dispatch])

    // 1. Loading Skeleton State
    if (loading) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6">
                    {Array.from({ length: 8 }).map((_, idx) => (
                        <div 
                            key={idx} 
                            className="aspect-[4/3] w-full rounded-2xl bg-slate-900 border border-white/[0.06] overflow-hidden relative"
                        >
                            <div className="absolute inset-0 animate-shimmer" />
                        </div>
                    ))}
                </div>
            </div>
        )
    }

    // 2. Error Alert State
    if (error) {
        return (
            <div className="max-w-md mx-auto px-4 py-16 text-center">
                <div className="w-14 h-14 mx-auto rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 flex items-center justify-center mb-4 shadow-lg shadow-red-500/5">
                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10"/>
                        <line x1="12" y1="8" x2="12" y2="12"/>
                        <line x1="12" y1="16" x2="12.01" y2="16"/>
                    </svg>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Unable to Load Media</h3>
                <p className="text-sm text-slate-400 mb-6 leading-relaxed">
                    {error}. Please check your connection or try a different search.
                </p>
            </div>
        )
    }

    // 3. Empty Search Results State
    if (results.length === 0) {
        return (
            <div className="max-w-md mx-auto px-4 py-16 text-center">
                <div className="w-14 h-14 mx-auto rounded-2xl bg-slate-900 border border-white/10 text-slate-400 flex items-center justify-center mb-4">
                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="11" cy="11" r="8"/>
                        <line x1="21" y1="21" x2="16.65" y2="16.65"/>
                    </svg>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">No {activeTab} Found</h3>
                <p className="text-sm text-slate-400 mb-6 leading-relaxed">
                    We couldn't find any {activeTab} matching "{query}". Try checking your spelling or search for broader keywords.
                </p>
            </div>
        )
    }

    // 4. Populated Grid
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 pb-16">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6">
                {results.map((item) => (
                    <ResultCard key={item.id} item={item} />
                ))}
            </div>
        </div>
    )
}

export default ResultGrid