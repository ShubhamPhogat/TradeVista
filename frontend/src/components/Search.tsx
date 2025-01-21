import { useState } from "react"

const Search = () => {
  const [input,setInput] = useState<string>("");
  return (
    <div className="flex items-center my-4 rounded-md focus:outline-none outline-none  relative z-50 w-96 bg-zinc-800 text-white ">
        <input 
        type="text"
        value={input}
        spellCheck='false'
        className="w-full px-4 py-2 bg-zinc-800 focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500 border-zinc-800 rounded-md"
        placeholder="Search Stocks..."
        onChange={(e)=>{setInput(e.target.value)}}
         />
    </div>
  )
}

export default Search