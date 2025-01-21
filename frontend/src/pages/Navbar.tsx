

const Navbar = () => {
  return (
    <div className="bg-zinc-900 fixed  z-[999] w-screen px-20  flex justify-between items-center">
        <div className="logo">
        <svg
  xmlns="http://www.w3.org/2000/svg"
  viewBox="0 0 400 100"
  width="300"
  height="75"
>
  <defs>
    <linearGradient id="textGradient" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#00e6e6" />
      <stop offset="100%" stop-color="#007bff" />
    </linearGradient>
  </defs>
  <text
    x="50%"
    y="50%"
    text-anchor="middle"
    font-size="36"
    font-family="'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
    fill="url(#textGradient)"
    font-weight="bold"
    dy=".3em"
  >
    TradeVista
  </text>
</svg>
        </div>
        <div className="nav-links flex gap-10 font-nueue">
         {['Home', 'About', 'Contact','Register','Login'].map((link,index)=>(
                <a href="#" key={index} className={`text-white text-xl py-2  ${index!==4 && 'hover:border-b-2  hover:border-sky-500'} ${index === 4 && 'transition ease-in duration-300 ml-32 border-[1px] px-5 rounded-full border-zinc-500 hover:bg-zinc-500 ' } `}>{link}</a>
         ))}
        </div>
    </div>
  )
}

export default Navbar