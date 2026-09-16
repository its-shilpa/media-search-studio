import { useDispatch } from "react-redux"
import { addCollection, addedToast } from "../redux/features/collectionSlice"

const ResultCard = ({item}) => {

  const dispatch = useDispatch()

  const addToCollection = (item) => {
    dispatch(addCollection(item))
    dispatch(addedToast())
  }

  return (
    <div className='w-full relative h-70 bg-white rounded-xl overflow-hidden'>
        <a target='_blank' href={item.url} className='h-full'>
          {item.type == 'photo'? <img className='h-full w-full object-center object-cover' src={item.src} alt="" />:''}
          {item.type == 'video'?<video className='h-full w-full object-center object-cover' autoPlay loop muted src={item.src}></video>:''}
        </a>
        <div id='bottom' className='flex justify-between items-center gap-2 w-full p-6 absolute bottom-0 text-white'>
          <h2 className='font-semibold capitalize'>{item.title}</h2>
          <button onClick={() => {
            addToCollection(item)
          }} className='bg-indigo-600 active:scale-95 text-white rounded px-3 py-2 cursor-pointer font-medium'>Save</button>
        </div>
    </div>
  )
}

export default ResultCard