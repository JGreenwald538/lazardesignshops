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
		<div ref={dropdownRef} className="relative">
			{" "}
			{/* Added relative positioning here */}
			<button
				className="border-2 border-black rounded px-2 text-xl"
				onClick={() => {
					setClicked(!clicked);
				}}
			>
				{displayName}
			</button>
			{clicked && (
				<div className="bg-white absolute top-full left-0 mt-1 rounded-md border-2 border-black flex flex-col z-20">
					{displayList.map((dropdown: string, index: number) => (
						<button
							key={index.toString()}
							className="px-1 last:border-b-0 border-b-2 border-black text-lg whitespace-nowrap"
							onClick={() => {
								setType(dropdown);
								setClicked(false); // Close dropdown after selection
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
