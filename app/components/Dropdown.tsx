import { useState, useEffect, useRef, Dispatch, SetStateAction } from "react";

export default function DropDown({
	displayName,
	displayList,
	setType,
}: {
	displayName: string;
	displayList: string[];
	setType: Dispatch<SetStateAction<string>>;
}) {
	const [clicked, setClicked] = useState(false);
	const dropdownRef = useRef<HTMLDivElement>(null);

	const handleClickOutside = (event: MouseEvent) => {
		if (
			dropdownRef.current &&
			!dropdownRef.current.contains(event.target as Node)
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
		<div ref={dropdownRef} className="relative z-20">
			<button
				className="store-button rounded-full border border-[#141110]/10 bg-[#141110] px-5 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-white shadow-lg shadow-[#141110]/15"
				onClick={() => {
					setClicked(!clicked);
				}}
			>
				{displayName}
			</button>
			{clicked && (
				<div className="absolute left-0 z-30 mt-2 flex min-w-max flex-col overflow-hidden rounded-2xl border border-[#141110]/10 bg-white shadow-2xl shadow-[#141110]/10">
					{displayList.map((dropdown: string, index: number) => (
						<button
							key={index.toString()}
							className="whitespace-nowrap border-b border-[#141110]/10 px-4 py-3 text-left text-sm font-semibold uppercase tracking-[0.15em] text-[#141110] last:border-b-0 hover:bg-[#f4ece3]"
							onClick={() => {
								setType(dropdown);
								setClicked(false);
							}}
						>
							{dropdown}
						</button>
					))}
				</div>
			)}
		</div>
	);
}
