
import './App.css'
import { Routes,Route } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import Mainlayout from './pages/Mainlayout'
import Dashboard from './components/Dashboard'

function App() {


  return (
   <Routes>
      <Route  element={<Mainlayout/>} > 
       <Route path="/" element={<LandingPage/>} />
       <Route path="/Dashboard/:market" element={<Dashboard/>}/>
      </Route>
   </Routes>
  )
}

export default App
