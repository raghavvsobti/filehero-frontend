import { type ReactNode } from "react";


const AnimatedGradientText = ({ children }: { children: ReactNode; }) => {

	return (
		<div className={"group cursor-pointer relative font-merriweather flex max-w-fit flex-row items-center justify-center bg-transparent pl-2 py-1.5 font-medium duration-500 ease-out [--bg-size:300%]"}>
			<span className={`text-3xl font-semibold tracking-normal font-merriweather inline  bg-gradient-to-r from-[#ffaa40] via-[#9c40ff] to-[#ffaa40] bg-[length:var(--bg-size)_100%] bg-clip-text text-transparent`}>
				{children}
			</span>
		</div>
	);
};

export default AnimatedGradientText;