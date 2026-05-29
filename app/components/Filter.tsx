import { usePathname, useRouter, useSearchParams } from "next/navigation";
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
	const router = useRouter();
	const pathname = usePathname();
	const selectedFilter = searchParams.get("f");
	const sortByType = searchParams.get("s");

	const handleFilterSelect = useCallback(
		(filterQuery: string) => {
			const nextParams = new URLSearchParams(searchParams.toString());

			if (selectedFilter === filterQuery) {
				nextParams.delete("f");
			} else {
				nextParams.set("f", filterQuery);
			}

			if (!sortByType) {
				nextParams.delete("s");
			}

			const queryString = nextParams.toString();
			router.replace(queryString ? `${pathname}?${queryString}` : pathname, {
				scroll: false,
			});
			closeMenu();
		},
		[closeMenu, pathname, router, searchParams, selectedFilter, sortByType],
	);

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
					{FilterList.map(
						(filter: { name: string; query: string }, index: number) => (
							<button
								type="button"
								key={index}
								className={`block w-full px-4 py-3 text-center text-sm font-semibold uppercase tracking-[0.18em] transition-colors hover:bg-[#f4ece3] ${
									selectedFilter === filter.query
										? "bg-[#141110] text-white hover:bg-[#141110]"
										: `${index % 2 === 0 ? "bg-white" : "bg-[#f9f4ee]"} text-[#141110]`
								}`}
								onClick={() => handleFilterSelect(filter.query)}
								aria-pressed={selectedFilter === filter.query}
							>
								{filter.name}
							</button>
						),
					)}
				</div>
			)}
			<button
				className={`store-button w-full border border-[#141110]/10 bg-[#141110] px-4 py-3 text-sm font-semibold uppercase tracking-[0.16em] text-white shadow-lg shadow-[#141110]/15 sm:px-5 sm:tracking-[0.2em] ${
					clicked ? "rounded-t-2xl" : "rounded-full"
				}`}
				onClick={toggleMenu}
			>
				Filter
			</button>
		</div>
	);
}
