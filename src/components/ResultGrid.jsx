import { useDispatch, useSelector } from 'react-redux'
import { useEffect, useRef, useCallback } from 'react'
import { AlertTriangle, SearchX, Loader2 } from 'lucide-react'
import { fetchPhotos, fetchVideos, fetchGifs } from '../api/mediaApi'
import {
  setLoading, setResults, appendResults,
  setLoadingMore, incrementPage, setError
} from '../redux/features/searchSlice'
import ResultCard from './ResultCard'

const PER_PAGE = 20
const GRID_CLASSES = "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6"

const ResultGrid = () => {
  const dispatch = useDispatch()
  const { query, activeTab, results, loading, loadingMore, error, page, hasMore } =
    useSelector((store) => store.search)

  const sentinelRef = useRef(null)
  const observerRef = useRef(null)

  const fetchPage = async (pageNum) => {
    if (activeTab === 'photos') {
      const response = await fetchPhotos(query, pageNum, PER_PAGE)
      return response.results.map((item) => ({
        id: item.id,
        type: 'photo',
        title: item.alt_description,
        thumbnail: item.urls.small,
        src: item.urls.full,
        url: item.links.html,
      }))
    }

    if (activeTab === 'gifs') {
        const response = await fetchGifs(query, pageNum, PER_PAGE)
        return response.data.map((item) => ({
        id: item.id,
        type: 'gif',
        title: item.title || 'Untitled GIF',
        thumbnail: item.images.fixed_width.url,
        src: item.images.original.url,
        url: item.url,
        }))
    }

    const response = await fetchVideos(query, pageNum, PER_PAGE)
    return response.videos.map((item) => ({
      id: item.id,
      type: 'video',
      title: item.user.name || 'Video',
      thumbnail: item.image,
      src: item.video_files[0].link,
      url: item.url,
    }))
  }

  // first page — runs whenever query or tab changes
  useEffect(() => {
    if (!query) return

    const getData = async () => {
      try {
        dispatch(setLoading())
        const data = await fetchPage(1)
        dispatch(setResults({ data, hasMore: data.length === PER_PAGE }))
      } catch (err) {
        dispatch(setError(err.message))
      }
    }

    getData()
  }, [query, activeTab])

  // subsequent pages
  const loadMore = useCallback(async () => {
    if (loading || loadingMore || !hasMore || !query) return
    try {
      dispatch(setLoadingMore())
      const nextPage = page + 1
      const data = await fetchPage(nextPage)
      dispatch(appendResults({ data, hasMore: data.length === PER_PAGE }))
      dispatch(incrementPage())
    } catch (err) {
      dispatch(setError(err.message))
    }
  }, [loading, loadingMore, hasMore, page, query, activeTab])

  // sentinel: fires loadMore when scrolled near the bottom
  useEffect(() => {
    if (!sentinelRef.current) return

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) loadMore()
      },
      { rootMargin: '600px' } // start fetching well before it's on screen
    )

    observerRef.current.observe(sentinelRef.current)
    return () => observerRef.current?.disconnect()
  }, [loadMore])

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className={GRID_CLASSES}>
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

  if (error)
    return (
      <div className="max-w-6xl mx-auto px-6 py-20 flex flex-col items-center text-center">
        <AlertTriangle className="w-9 h-9 text-(--danger) mb-4" strokeWidth={1.5} />
        <h3 className="text-lg font-medium text-(--text) mb-1.5">Something went wrong</h3>
        <p className="text-sm text-(--text-faint) max-w-sm">{error}</p>
      </div>
    )

  if (results.length === 0)
    return (
      <div className="max-w-6xl mx-auto px-6 py-20 flex flex-col items-center text-center">
        <SearchX className="w-9 h-9 text-(--text-faint) mb-4" strokeWidth={1.5} />
        <h3 className="text-lg font-medium text-(--text) mb-1.5">No {activeTab} found</h3>
      </div>
    )

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
      <div className={GRID_CLASSES}>
        {results.map((item, idx) => (
          <ResultCard key={item.id ?? idx} item={item} />
        ))}
      </div>

      {/* invisible trigger element */}
      <div ref={sentinelRef} className="h-1" />

      {loadingMore && (
        <div className="flex justify-center py-8">
          <Loader2 className="w-5 h-5 animate-spin text-(--accent)" />
        </div>
      )}

      {!hasMore && results.length > 0 && (
        <p className="text-center text-xs text-(--text-faint) py-8">
          You've reached the end
        </p>
      )}
    </div>
  )
}

export default ResultGrid