import { Outlet } from "react-router-dom"
import Navbar from "./Navbar"

const Mainlayout = () => {
  return (
    <div className="h-screen w-screen overflow-x-hidden bg-zinc-900">
        <Navbar />
       <div className="pt-[6rem] bg-zinc-900">
       <Outlet />
       </div>
    </div>
  )
}

export default Mainlayout