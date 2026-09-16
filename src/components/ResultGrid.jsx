import { useDispatch, useSelector } from 'react-redux'
import { fetchPhotos, fetchVideos } from '../api/mediaApi'
import { setLoading, setResults, setError } from '../redux/features/searchSlice'
import { useEffect } from 'react'
import ResultCard from './ResultCard'

const ResultGrid = () => {

    const dispatch = useDispatch()
    const {query,activeTab,results,loading,error} = useSelector((store) => store.search)

    useEffect( function() {
        if(!query) return
        const getData = async () => {

        try {

            dispatch(setLoading()) 
            let data = []

            if(activeTab == 'photos') {                                     
                let response = await fetchPhotos(query)
                data = response.results.map((item) => ({
                    id: item.id,
                    type: 'photo',
                    title: item.alt_description,
                    thumbnail: item.urls.small,
                    src: item.urls.full,
                    url: item.links.html
                }))
            }
            if(activeTab == 'videos') {
                let response = await fetchVideos(query)
                data = response.videos.map((item) => ({
                    id: item.id,
                    type: 'video',
                    title: item.user.name || 'Video',
                    thumbnail: item.image,
                    src: item.video_files[0].link,
                    url: item.url
                }))
            }

            dispatch(setResults(data))
            
        } catch (err) {
            dispatch(setError(err.message))
        }
        
    }

    getData()
    }, [query, activeTab, dispatch])

    if(error) return <h1>Error</h1>
    if(loading) return <h1>Loading...</h1>
    
  return (
    <div className='grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-5 px-5 w-full overflow-auto'>
        {results.map((item,idx) => {
            return <div key={idx}>
                <ResultCard item={item}/>
            </div>
        })}
    </div>
  )
}

export default ResultGrid