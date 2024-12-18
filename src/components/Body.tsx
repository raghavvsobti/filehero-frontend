import { ReactNode } from "react"

const Body = ({ children }: { children: ReactNode }) => {
	return (
		<div className='md:px-36 px-4 h-screen text-gray-800 font-comfortaa'>{children}</div>
	)
}

export default Body