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

const mapPhotos = (results = []) =>
  results.map((item) => ({
    id: item.id,
    type: 'photo',
    title: item.alt_description || item.description || 'Photo',
    thumbnail: item.urls?.small || item.urls?.thumb,
    src: item.urls?.regular || item.urls?.small,
    url: item.links?.html,
  }))

const mapGifs = (data = []) =>
  data.map((item) => ({
    id: item.id,
    type: 'gif',
    title: item.title || 'Untitled GIF',
    thumbnail: item.images?.fixed_width_still?.url || item.images?.fixed_width?.url,
    src: item.images?.fixed_width?.url || item.images?.downsized_medium?.url || item.images?.original?.url,
    url: item.url,
  }))

const mapVideos = (videos = []) =>
  videos.map((item) => {
    const files = item.video_files || []
    const previewFile =
      files.find((f) => f.width === 720 || f.width === 540) ||
      files.find((f) => f.quality === 'sd') ||
      files.find((f) => f.width && f.width <= 1080) ||
      files[0]

    return {
      id: item.id,
      type: 'video',
      title: item.user?.name ? `Video by ${item.user.name}` : 'Video',
      thumbnail: item.image || item.video_pictures?.[0]?.picture,
      src: previewFile?.link || '',
      url: item.url,
    }
  })

const ResultGrid = () => {
  const dispatch = useDispatch()
  const { query, activeTab, results, loading, loadingMore, error, page, hasMore } =
    useSelector((store) => store.search)

  const sentinelRef = useRef(null)
  const isFetchingRef = useRef(false)

  const fetchPage = async (pageNum) => {
    if (activeTab === 'all') {
      const [photosRes, videosRes, gifsRes] = await Promise.allSettled([
        fetchPhotos(query, pageNum, 8),
        fetchVideos(query, pageNum, 6),
        fetchGifs(query, pageNum, 6),
      ])

      const photos = photosRes.status === 'fulfilled' ? mapPhotos(photosRes.value.results || []) : []
      const videos = videosRes.status === 'fulfilled' ? mapVideos(videosRes.value.videos || []) : []
      const gifs = gifsRes.status === 'fulfilled' ? mapGifs(gifsRes.value.data || []) : []

      if (photosRes.status === 'rejected' && videosRes.status === 'rejected' && gifsRes.status === 'rejected') {
        throw new Error(
          photosRes.reason?.message || videosRes.reason?.message || gifsRes.reason?.message || 'Failed to fetch media'
        )
      }

      // Round-robin mixture to interleave photos, videos, and gifs evenly
      const mixed = []
      const maxLen = Math.max(photos.length, videos.length, gifs.length)
      for (let i = 0; i < maxLen; i++) {
        if (photos[i]) mixed.push(photos[i])
        if (videos[i]) mixed.push(videos[i])
        if (gifs[i]) mixed.push(gifs[i])
      }
      return mixed
    }

    if (activeTab === 'photos') {
      const response = await fetchPhotos(query, pageNum, PER_PAGE)
      return mapPhotos(response.results || [])
    }

    if (activeTab === 'gifs') {
      const response = await fetchGifs(query, pageNum, PER_PAGE)
      return mapGifs(response.data || [])
    }

    const response = await fetchVideos(query, pageNum, PER_PAGE)
    return mapVideos(response.videos || [])
  }

  // first page — runs whenever query or tab changes
  useEffect(() => {
    if (!query) return
    let isCurrent = true

    const getData = async () => {
      try {
        isFetchingRef.current = true
        dispatch(setLoading())
        const data = await fetchPage(1)
        if (!isCurrent) return
        const minExpected = activeTab === 'all' ? 4 : Math.min(10, PER_PAGE)
        dispatch(setResults({ data, hasMore: data.length >= minExpected }))
      } catch (err) {
        if (!isCurrent) return
        dispatch(setError(err.message))
      } finally {
        if (isCurrent) {
          isFetchingRef.current = false
        }
      }
    }

    getData()

    return () => {
      isCurrent = false
      isFetchingRef.current = false
    }
  }, [query, activeTab])

  // subsequent pages
  const loadMore = useCallback(async () => {
    if (isFetchingRef.current || loading || loadingMore || !hasMore || !query) return
    isFetchingRef.current = true
    try {
      dispatch(setLoadingMore())
      const nextPage = page + 1
      const data = await fetchPage(nextPage)
      const minExpected = activeTab === 'all' ? 4 : Math.min(10, PER_PAGE)
      dispatch(appendResults({ data, hasMore: data.length >= minExpected }))
      dispatch(incrementPage())
    } catch (err) {
      dispatch(setError(err.message))
    } finally {
      isFetchingRef.current = false
    }
  }, [loading, loadingMore, hasMore, page, query, activeTab])

  // sentinel: fires loadMore when scrolled near the bottom
  useEffect(() => {
    const sentinel = sentinelRef.current
    if (!sentinel) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMore()
        }
      },
      { rootMargin: '300px' }
    )

    observer.observe(sentinel)
    return () => observer.disconnect()
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
        <AlertTriangle className="w-9 h-9 text-rose-500 mb-4" strokeWidth={1.5} />
        <h3 className="text-lg font-medium text-slate-200 mb-1.5">Something went wrong</h3>
        <p className="text-sm text-slate-400 max-w-sm">{error}</p>
      </div>
    )

  if (results.length === 0)
    return (
      <div className="max-w-6xl mx-auto px-6 py-20 flex flex-col items-center text-center">
        <SearchX className="w-9 h-9 text-slate-500 mb-4" strokeWidth={1.5} />
        <h3 className="text-lg font-medium text-slate-200 mb-1.5">
          No {activeTab === 'all' ? 'media' : activeTab} found
        </h3>
        <p className="text-sm text-slate-400 max-w-sm">
          Try searching for different keywords or explore suggested topics.
        </p>
      </div>
    )

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
      <div className={GRID_CLASSES}>
        {results.map((item, idx) => (
          <ResultCard key={`${item.type}-${item.id}-${idx}`} item={item} />
        ))}
      </div>

      {/* invisible trigger element */}
      <div ref={sentinelRef} className="h-1" />

      {loadingMore && (
        <div className="flex justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin text-indigo-400" />
        </div>
      )}

      {!hasMore && results.length > 0 && (
        <p className="text-center text-xs text-slate-400 py-8">
          You've reached the end
        </p>
      )}
    </div>
  )
}

export default ResultGrid