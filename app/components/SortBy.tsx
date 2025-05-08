import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState, useEffect, useRef } from "react";

const SortByList = [
	{ title: "Price", param: "price" },
	{ title: "Alphabetical", param: "alpha" },
	{ title: "Release Date", param: "release" },
];

export default function Filter() {
	const [clicked, setClicked] = useState(false);
	const filterRef = useRef<HTMLDivElement>(null);
	const searchParams = useSearchParams();

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

	return (
		<div ref={filterRef}>
			{clicked && (
				<div className="bg-white absolute translate-y-8 rounded-md border-2 border-black flex flex-col">
					{SortByList.map(
						(filter: { title: string; param: string }, index: number) => {
							const order = sortByType === filter.param + "asec" ? "desc" : "asec"
							return (
								<a
									key={index.toString()}
									className="px-1 last:border-b-0 border-b-2 border-black"
									href={`/?f=${filterType}&s=${filter.param}${order}`}
								>
									{filter.title}
								</a>
							);
						}
					)}
				</div>
			)}
			<button
				className="bg-[#e35050] text-white rounded px-3 text-xl"
				onClick={() => {
					setClicked(!clicked);
				}}
			>
				Sort By
			</button>
		</div>
	);
}
