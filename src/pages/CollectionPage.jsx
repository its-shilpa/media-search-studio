import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import CollectionCard from '../components/CollectionCard'
import { clearCollection } from '../redux/features/collectionSlice'

const CollectionPage = () => {

    const collection = useSelector(state => state.collection.items)

    const dispatch = useDispatch()

    const clearTheCollection = () => {
        dispatch(clearCollection())
    }

  return (
   <div className='w-full overflow-auto px-10 py-10'>
        {collection.length>0? 
        <div className='flex justify-between text-center gap-2 mb-6'>
            <h2 className='text-xl font-bold'>Your Collections</h2>
            <button
            onClick={() => {
                clearTheCollection()
            }}
            className='bg-red-600 px-5 py-3 cursor-pointer text-center text-base font-medium rounded transition active:scale-95'>Clear Collection</button>
        </div> : <h2 className='text-2xl text-center font-bold'>Collection is empty..!!</h2> }
        <div className='grid grid-cols-[repeat(auto-fit,minmax(280px,350px))] justify-start gap-5'>
            {collection.map((item,idx) => {
                return <div key={idx}>
                    <CollectionCard item={item}/>
                </div>
            })}
        </div>
   </div>
  )
}

export default CollectionPage