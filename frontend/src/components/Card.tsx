

const Card = ({children}:{children:React.ReactNode}) => {
  return (
    <div className="w-full h-full p-8 bg-zinc-800 rounded-md relative">
        {children}
    </div>
  )
}

export default Card