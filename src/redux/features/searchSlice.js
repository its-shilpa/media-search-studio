import { createSlice } from "@reduxjs/toolkit";

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
    },
    reducers:{
        setQuery(state,action){
            state.query = action.payload
            state.page = 1
            state.results = []
            state.hasMore = true
            state.error = null
        },
        setActiveTabs(state,action){
            state.activeTab = action.payload
            state.page = 1
            state.results = []
            state.hasMore = true
            state.error = null
        },
        setResults(state,action){
            state.results = action.payload.data
            state.hasMore = action.payload.hasMore
            state.loading = false
        },
        appendResults(state, action) {
            state.results = [...state.results, ...action.payload.data]
            state.hasMore = action.payload.hasMore
            state.loadingMore = false
        },
        setLoading(state){
            state.loading = true
            state.error = null
        },
        setLoadingMore(state) {
            state.loadingMore = true
        },
        incrementPage(state) {
            state.page += 1
        },
        setError(state,action){
            state.error = action.payload
            state.loading = false
            state.loadingMore = false
        },
        clearResults(state){
            state.results = []
        }
    }
})

export const {
    setQuery, setActiveTabs, setResults, appendResults,
    incrementPage, setLoading, setLoadingMore, setError, clearResults
} = searchSlice.actions

export default searchSlice.reducer;