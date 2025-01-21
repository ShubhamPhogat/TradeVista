
const LandingPage = () => {
    return (
        <div className="bg-zinc-900 pt-20 h-screen w-screen ">
            <div className="mb-40 px-40">
            <div className="hero text-white uppercase text-8xl font-grotesk">
                <h1>Trading Made</h1>
            </div>
            <div className="hero flex gap-7 align-baseline text-white uppercase text-8xl font-grotesk">
                <h1>Simple</h1>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 400 200"
                    width="200"
                    height="100"
                    style={{
                        background: "linear-gradient(to right, #001f3f, #007bff)",
                        borderRadius: "10px",
                    }}
                >
                
                    <g stroke="rgba(255, 255, 255, 0.1)" stroke-width="0.5">
                        <line x1="0" y1="20" x2="400" y2="20" />
                        <line x1="0" y1="60" x2="400" y2="60" />
                        <line x1="0" y1="100" x2="400" y2="100" />
                        <line x1="0" y1="140" x2="400" y2="140" />
                        <line x1="0" y1="180" x2="400" y2="180" />
                    </g>
                    <polyline
                        points="20,180 100,120 180,140 260,60 340,100"
                        fill="none"
                        stroke="url(#gradient)"
                        stroke-width="3"
                        stroke-linejoin="round"
                        stroke-linecap="round"
                    />

                    <defs>
                        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stop-color="#00e6e6" />
                            <stop offset="100%" stop-color="#007bff" />
                        </linearGradient>
                        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                            <feGaussianBlur stdDeviation="5" result="coloredBlur" />
                            <feMerge>
                                <feMergeNode in="coloredBlur" />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>
                    </defs>

                    <polyline
                        points="20,180 100,120 180,140 260,60 340,100"
                        fill="none"
                        stroke="url(#gradient)"
                        stroke-width="3"
                        filter="url(#glow)"
                    />


                </svg>
            </div>
            </div>
            <div className="border-t-[1px] pt-4 px-6 font-icomoon flex text-white justify-between w-screen border-zinc-400 ">
             {['Open Dmat Account', 'Trade Now', 'Learn More'].map((item, index) => (
                <p key={index} className="border-[1px] px-6 py-1 transition ease-in duration-300 hover:bg-blue-400 rounded-full">{item}</p>
             ))}
            </div>
        </div>
    )
}

export default LandingPage