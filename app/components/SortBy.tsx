import { useSearchParams } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { FaArrowDown, FaArrowUp } from "react-icons/fa6";

const SortByList = [
	{ title: "Price", param: "price" },
	{ title: "A-Z", param: "alpha" },
	{ title: "Release Date", param: "release" },
];

export default function Filter() {
	const [clicked, setClicked] = useState(false);
	const filterRef = useRef<HTMLDivElement>(null);
	const searchParams = useSearchParams();

	const [shouldRender, setShouldRender] = useState(false);
	const [isAnimating, setIsAnimating] = useState(false);

	const handleClickOutside = (event: MouseEvent) => {
		if (
			filterRef.current &&
			!filterRef.current.contains(event.target as Node)
		) {
			setClicked(false);
		}
	};

	useEffect(() => {
		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, []);

	const filterType = searchParams.get("f");
	const sortByType = searchParams.get("s");

	useEffect(() => {
		if (clicked) {
			// Solution 1: Render element first
			setShouldRender(true);

			// Solution 2: Force initial state, then animate
			// Use double RAF to ensure DOM is rendered and styled
			requestAnimationFrame(() => {
				requestAnimationFrame(() => {
					setIsAnimating(true);
				});
			});
		} else {
			// Closing animation
			setIsAnimating(false);

			// Solution 3: Wait for animation to complete before removing
			const timer = setTimeout(() => {
				setShouldRender(false);
			}, 200);
			return () => clearTimeout(timer);
		}
	}, [clicked]);

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
					{SortByList.map(
						(sort: { title: string; param: string }, index: number) => {
							const order =
								sortByType === sort.param + "asec" ? "desc" : "asec";
							return (
								<a
									href={`/?f=${filterType}&s=${sort.param}${order}`}
									key={index}
									className={`block px-4 text-white text-center hover:brightness-90 transition-all ${
										index % 2 === 0 ? "bg-[#F5615C]" : " bg-[#e35050]"
									} last:rounded-b-md flex flex-row items-center justify-between`}
								>
									<div>{sort.title}</div>
									{sortByType === sort.param + "desc" ? (
										<FaArrowDown color={"#206DCC"} />
									) : sortByType === sort.param + "asec" ? (
										<FaArrowUp color={"#206DCC"} />
									) : (
										<FaArrowUp color="white" />
									)}
								</a>
							);
						}
					)}
				</div>
			)}
			<button
				className={`bg-[#e35050] text-white ${
					clicked ? "rounded-t" : "rounded"
				} px-4 text-xl font-semibold`}
				onClick={() => {
					setClicked(!clicked);
				}}
			>
				Sort By
			</button>
		</div>
	);
}
