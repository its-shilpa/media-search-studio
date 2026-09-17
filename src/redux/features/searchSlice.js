import { createSlice } from "@reduxjs/toolkit";

const MAX_CACHE_ENTRIES = 40;

const getCacheKey = (query, tab) => `${(query || '').trim().toLowerCase()}__${tab}`;

const searchSlice = createSlice({
    name: "search",
    initialState:{
        query:'',
        activeTab:'all',
        results:[],
        loading: false,     
        loadingMore: false,
        error:null,
        page: 1,
        hasMore: true,
        cache: {}, // Key: query__tab -> { results, page, hasMore }
    },
    reducers:{
        setQuery(state,action){
            const newQuery = action.payload;
            state.query = newQuery;
            state.error = null;

            if (!newQuery) {
                state.results = [];
                state.page = 1;
                state.hasMore = true;
                state.loading = false;
                return;
            }

            const key = getCacheKey(newQuery, state.activeTab);
            if (state.cache[key]) {
                const cached = state.cache[key];
                state.results = cached.results;
                state.page = cached.page;
                state.hasMore = cached.hasMore;
                state.loading = false;
            } else {
                state.results = [];
                state.page = 1;
                state.hasMore = true;
                state.loading = false;
            }
        },
        setActiveTabs(state,action){
            const newTab = action.payload;
            state.activeTab = newTab;
            state.error = null;

            if (!state.query) {
                state.results = [];
                state.page = 1;
                state.hasMore = true;
                state.loading = false;
                return;
            }

            const key = getCacheKey(state.query, newTab);
            if (state.cache[key]) {
                const cached = state.cache[key];
                state.results = cached.results;
                state.page = cached.page;
                state.hasMore = cached.hasMore;
                state.loading = false;
            } else {
                state.results = [];
                state.page = 1;
                state.hasMore = true;
                state.loading = false;
            }
        },
        setResults(state,action){
            const { data, hasMore } = action.payload;
            state.results = data;
            state.hasMore = hasMore;
            state.loading = false;

            if (state.query) {
                const key = getCacheKey(state.query, state.activeTab);
                const keys = Object.keys(state.cache);
                if (keys.length >= MAX_CACHE_ENTRIES && !state.cache[key]) {
                    delete state.cache[keys[0]];
                }
                state.cache[key] = {
                    results: data,
                    page: state.page,
                    hasMore: hasMore
                };
            }
        },
        appendResults(state, action) {
            const { data, hasMore } = action.payload;
            state.results = [...state.results, ...data];
            state.hasMore = hasMore;
            state.loadingMore = false;

            if (state.query) {
                const key = getCacheKey(state.query, state.activeTab);
                state.cache[key] = {
                    results: state.results,
                    page: state.page + 1,
                    hasMore: hasMore
                };
            }
        },
        setLoading(state){
            state.loading = true;
            state.error = null;
        },
        setLoadingMore(state) {
            state.loadingMore = true;
        },
        incrementPage(state) {
            state.page += 1;
        },
        setError(state,action){
            state.error = action.payload;
            state.loading = false;
            state.loadingMore = false;
        },
        clearResults(state){
            state.results = [];
        },
        clearCache(state){
            state.cache = {};
        }
    }
})

export const {
    setQuery, setActiveTabs, setResults, appendResults,
    incrementPage, setLoading, setLoadingMore, setError, clearResults, clearCache
} = searchSlice.actions;

export default searchSlice.reducer;