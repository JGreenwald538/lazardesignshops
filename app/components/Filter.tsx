import { useState, useEffect, useRef } from "react";

const FilterList = ["Prints", "Clothing", "Other"];

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
					{FilterList.map((filter: string, index: number) => (
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
				className="bg-[#e35050] text-white rounded px-4 text-xl"
				onClick={() => {
					setClicked(!clicked);
				}}
			>
				Filter
			</button>
		</div>
	);
}
