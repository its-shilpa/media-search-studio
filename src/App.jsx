import { Route, Routes } from "react-router-dom"
import Homepage from "./pages/Homepage"
import CollectionPage from "./pages/CollectionPage"
import Navbar from "./components/Navbar"
import { ToastContainer} from 'react-toastify';


const App = () => {


  return (
    <div className='min-h-screen w-full text-white bg-gray-950'>
      <Navbar/>
      <Routes>
        <Route path="/" element={<Homepage/>}/>
        <Route path="/collection" element={<CollectionPage/>}/>
      </Routes>

      <ToastContainer/>
      
    </div>
  )
}

export default App