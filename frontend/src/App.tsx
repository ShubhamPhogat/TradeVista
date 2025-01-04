
import './App.css'
import { Routes,Route } from 'react-router-dom'
import LandingPage from './components/LandingPage'
import Mainlayout from './components/Mainlayout'
function App() {


  return (
   <Routes>
      <Route  element={<Mainlayout/>} > 
       <Route path="/" element={<LandingPage/>} />
      </Route>
   </Routes>
  )
}

export default App
