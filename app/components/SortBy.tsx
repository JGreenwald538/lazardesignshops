import { useState, useEffect, useRef } from "react";

const SortByList = [
	"Price: Highest to Lowest",
	"Price: Lowest to Highest",
	"Alphabetical",
	"Release Date: Oldest to Newest",
	"Release Date: Newest to Oldest",
];

export default function Filter() {
	const [clicked, setClicked] = useState(false);
	const filterRef = useRef<HTMLDivElement>(null);

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

	return (
		<div ref={filterRef}>
			{clicked && (
				<div className="bg-white absolute translate-y-8 rounded-md border-2 border-black">
					{SortByList.map((filter: string, index: number) => (
						<div
							key={index.toString()}
							className="px-1 last:border-b-0 border-b-2 border-black"
						>
							{filter}
						</div>
					))}
				</div>
			)}
			<button
				className="border-[#5055ba] bg-[#5055ba] text-white rounded px-2 text-xl"
				onClick={() => {
					setClicked(!clicked);
				}}
			>
				Sort By
			</button>
		</div>
	);
}
