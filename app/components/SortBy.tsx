import { useSearchParams } from "next/navigation";
import { useState, useEffect, useRef, useCallback } from "react";
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
	const closeTimerRef = useRef<number | null>(null);

	const [shouldRender, setShouldRender] = useState(false);
	const [isAnimating, setIsAnimating] = useState(false);

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

	const filterType = searchParams.get("f");
	const sortByType = searchParams.get("s");

	return (
		<div ref={filterRef} className="relative z-[1000] inline-block w-full sm:w-auto">
			{shouldRender && (
				<div
					className={`
						absolute left-0 right-0 z-[1010] translate-y-3 overflow-hidden rounded-2xl border border-[#141110]/10 bg-white/95 shadow-2xl shadow-[#141110]/10 backdrop-blur-xl flex flex-col
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
									className={`flex flex-row items-center justify-between px-4 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-[#141110] transition-colors hover:bg-[#f4ece3] ${
										index % 2 === 0 ? "bg-white" : "bg-[#f9f4ee]"
									}`}
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
						},
					)}
				</div>
			)}
			<button
				className={`store-button w-full border border-[#141110]/10 bg-white/80 px-4 py-3 text-sm font-semibold uppercase tracking-[0.16em] text-[#141110] shadow-lg shadow-[#141110]/10 sm:px-5 sm:tracking-[0.2em] ${
					clicked ? "rounded-t-2xl" : "rounded-full"
				}`}
				onClick={toggleMenu}
			>
				Sort By
			</button>
		</div>
	);
}
