import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { setQuery } from '../redux/features/searchSlice'

const SearchBar = () => {

    const [text, setText] = useState('')

    const dispatch = useDispatch()

    const submitHandler = (e) => {
        e.preventDefault()
        
        dispatch(setQuery(text))
        
        setText('')
    }

  return (
    <div className="bg-(--c2) py-10">
    <form 
        onSubmit={submitHandler}
        className="max-w-5xl mx-auto flex gap-3 px-6"
    >

        <input
            value={text}
            onChange={(e)=>setText(e.target.value)}
            type="text"
            placeholder="Search anything..."
            className="
            flex-1
            bg-white/10
            border
            border-white/30
            text-white
            placeholder:text-white/50
            px-5
            py-3
            rounded-xl
            text-lg
            outline-none
            focus:border-(--c4)
            transition
            "
            required
        />

        <button
            className="
            px-8
            rounded-xl
            bg-(--c4)
            text-(--c1)
            font-semibold
            hover:scale-105
            active:scale-95
            transition
            "
        >
            Search
        </button>

    </form>
</div>
  )
}

export default SearchBar