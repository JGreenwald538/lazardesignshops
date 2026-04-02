import { useSearchParams } from "next/navigation";
import { useState, useEffect, useRef, useCallback } from "react";

const FilterList = [
	{ name: "Posters", query: "posters" },
	{ name: "Tshirts", query: "tshirts" },
	{ name: "Other", query: "other" },
];

export default function Filter() {
	const [clicked, setClicked] = useState(false);
	const [shouldRender, setShouldRender] = useState(false);
	const [isAnimating, setIsAnimating] = useState(false);
	const filterRef = useRef<HTMLDivElement>(null);
	const closeTimerRef = useRef<number | null>(null);

	const openMenu = useCallback(() => {
		if (closeTimerRef.current) {
			window.clearTimeout(closeTimerRef.current);
			closeTimerRef.current = null;
		}
		setShouldRender(true);
		setClicked(true);

		requestAnimationFrame(() => {
			requestAnimationFrame(() => {
				setIsAnimating(true);
			});
		});
	}, []);

	const closeMenu = useCallback(() => {
		if (closeTimerRef.current) {
			window.clearTimeout(closeTimerRef.current);
		}
		setClicked(false);
		setIsAnimating(false);
		closeTimerRef.current = window.setTimeout(() => {
			setShouldRender(false);
			closeTimerRef.current = null;
		}, 200);
	}, []);

	const toggleMenu = useCallback(() => {
		if (clicked) {
			closeMenu();
			return;
		}
		openMenu();
	}, [clicked, closeMenu, openMenu]);

	const handleClickOutside = useCallback(
		(event: MouseEvent) => {
			if (
				filterRef.current &&
				!filterRef.current.contains(event.target as Node)
			) {
				closeMenu();
			}
		},
		[closeMenu],
	);

	useEffect(() => {
		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
			if (closeTimerRef.current) {
				window.clearTimeout(closeTimerRef.current);
			}
		};
	}, [handleClickOutside]);

	const searchParams = useSearchParams();
	const sortByType = searchParams.get("s");

	return (
		<div ref={filterRef} className="relative inline-block">
			{shouldRender && (
				<div
					className={`
						absolute left-0 right-0 translate-y-7 rounded-b-md flex flex-col 
						transition-all duration-200
						${
							isAnimating
								? "opacity-100 scale-y-100 ease-in"
								: "opacity-0 scale-y-0 ease-out"
						}
					`}
					style={{
						transformOrigin: "top",
					}}
				>
					{FilterList.map(
						(filter: { name: string; query: string }, index: number) => (
							<a
								href={`/?f=${filter.query}&s=${sortByType}`}
								key={index}
								className={`block px-4 text-white text-center hover:brightness-90 transition-all ${
									index % 2 === 0 ? "bg-[#F5615C]" : " bg-[#e35050]"
								} last:rounded-b-md`}
							>
								{filter.name}
							</a>
						),
					)}
				</div>
			)}
			<button
				className={`bg-[#e35050] text-white ${
					clicked ? "rounded-t" : "rounded"
				} px-4 text-xl font-semibold`}
				onClick={toggleMenu}
			>
				Filter
			</button>
		</div>
	);
}
