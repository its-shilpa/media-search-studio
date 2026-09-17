import { Route, Routes } from "react-router-dom"
import Homepage from "./pages/Homepage"
import CollectionPage from "./pages/CollectionPage"
import Navbar from "./components/Navbar"
import { ToastContainer} from 'react-toastify';


const App = () => {


  return (
    <div className='min-h-screen w-full text-slate-100 bg-[#090d16] flex flex-col selection:bg-indigo-500/30 selection:text-indigo-200'>
      <Navbar/>
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Homepage/>}/>
          <Route path="/collection" element={<CollectionPage/>}/>
        </Routes>
      </main>
      <ToastContainer
        position="bottom-right"
        theme="dark"
        toastClassName="!bg-slate-900 !text-slate-100 !border !border-white/10 !rounded-xl !shadow-2xl"
      />
    </div>
  )
}

export default App