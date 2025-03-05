import { useState, useEffect, useRef } from "react";

export default function DropDown({displayName, displayList} : {displayName: string, displayList: string[]}) {
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
        <div ref={dropdownRef}>
            {clicked && (
                <div className="bg-white absolute translate-y-8 rounded-md border-2 border-black">
                    {displayList.map((dropdown: string, index: number) => (
                        <div
                            key={index.toString()}
                            className="px-1 last:border-b-0 border-b-2 border-black"
                        >
                            {dropdown}
                        </div>
                    ))}
                </div>
            )}
            <button
                className="border-2 border-black rounded px-2 text-xl"
                onClick={() => {
                    setClicked(!clicked);
                }}
            >
                {displayName}
            </button>
        </div>
    );
}
