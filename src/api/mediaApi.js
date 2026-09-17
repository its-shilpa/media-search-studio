import axios from "axios";

const UNSPLASH_KEY = import.meta.env.VITE_UNSPLASH_KEY
const PEXELS_KEY = import.meta.env.VITE_PEXELS_KEY
const GIPHY_KEY = import.meta.env.VITE_GIPHY_KEY

// In-memory cache with 10-minute TTL to prevent redundant network calls
const apiCache = new Map();
const CACHE_TTL = 10 * 60 * 1000;
const MAX_CACHE_SIZE = 150;

function getCached(key) {
    const entry = apiCache.get(key);
    if (!entry) return null;
    if (Date.now() - entry.time > CACHE_TTL) {
        apiCache.delete(key);
        return null;
    }
    return entry.data;
}

function setCached(key, data) {
    if (apiCache.size >= MAX_CACHE_SIZE) {
        const oldestKey = apiCache.keys().next().value;
        apiCache.delete(oldestKey);
    }
    apiCache.set(key, { data, time: Date.now() });
}

export async function fetchPhotos(query, page = 1, per_page = 20) {
    const cacheKey = `photos:${(query || '').trim().toLowerCase()}:${page}:${per_page}`;
    const cached = getCached(cacheKey);
    if (cached) return cached;

    const res = await axios.get('https://api.unsplash.com/search/photos', {
        params: { query, page, per_page },
        headers: { Authorization: `Client-ID ${UNSPLASH_KEY}` }
    });

    setCached(cacheKey, res.data);
    return res.data;
}

export async function fetchVideos(query, page = 1, per_page = 20) {
    const cacheKey = `videos:${(query || '').trim().toLowerCase()}:${page}:${per_page}`;
    const cached = getCached(cacheKey);
    if (cached) return cached;

    const res = await axios.get('https://api.pexels.com/v1/videos/search', {
        params: { query, page, per_page },
        headers: { Authorization: PEXELS_KEY }
    });

    setCached(cacheKey, res.data);
    return res.data;
}

export async function fetchGifs(query, page = 1, per_page = 20) {
    const offset = (page - 1) * per_page;
    const cacheKey = `gifs:${(query || '').trim().toLowerCase()}:${page}:${per_page}`;
    const cached = getCached(cacheKey);
    if (cached) return cached;

    const res = await axios.get('https://api.giphy.com/v1/gifs/search', {
        params: {
            api_key: GIPHY_KEY,
            q: query,
            limit: per_page,
            offset,
            rating: 'g'
        }
    });

    setCached(cacheKey, res.data);
    return res.data;
}