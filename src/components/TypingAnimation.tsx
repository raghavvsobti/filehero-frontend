/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useEffect, useState } from "react";


interface TypingAnimationProps {
	text: string;
	duration?: number;
	className?: string;
}

export function TypingAnimation({
	text,
	duration = 100,
}: TypingAnimationProps) {
	const [displayedText, setDisplayedText] = useState<string>("");
	const [i, setI] = useState<number>(0);

	useEffect(() => {
		const typingEffect = setInterval(() => {
			if (i < text.length) {
				setDisplayedText(text.substring(0, i + 1));
				setI(i + 1);
			} else {
				clearInterval(typingEffect);
			}
		}, duration);

		return () => {
			clearInterval(typingEffect);
		};
	}, [duration, i]);

	return (
		<h1 className={"font-merriweather text-center text-3xl md:text-4xl font-bold leading-[2rem] tracking-[-0.02em] drop-shadow-sm"}
		>
			{displayedText ? displayedText : text}
		</h1>
	);
}
