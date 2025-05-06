"use client"

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FaShoppingCart } from "react-icons/fa";
import { NumberInCart } from "../utils/Cart";

export default function TopBar() {
	const [cartNumber, setCartNumber] = useState(0);

	useEffect(() => {
		NumberInCart().then((number) => setCartNumber(number));
	});
	return (
		<div className="md:px-24 px-10 pt-8 w-full flex md:flex-row flex-col justify-between items-center md:space-y-0 space-y-5">
			<Link
				href={"/"}
				className="object-scale-down md:w-[12%] w-1/2 justify-start mr-4"
			>
				<Image
					src="/Lazar.Wide.white.png"
					alt=""
					width={4574}
					height={2092}
					className=""
				/>
			</Link>
			<div className="md:w-full md:px-0 px-5 rounded flex md:flex-row flex-col py-5 items-center md:gap-y-0 gap-y-5">
				<div className="flex-1 flex justify-self-start md:gap-x-5 md:ml-5 md:flex-row flex-col md:gap-y-0 gap-y-3">
					<a
						className="text-xl bg-[#e35050] text-white rounded px-3 py-1 whitespace-pre"
						href={"/?f=posters"}
					>
						{"Posters"}
					</a>
					<a
						className="text-xl bg-[#e35050] text-white rounded px-3 py-1"
						href={"/?f=tshirts"}
					>
						T-Shirts
					</a>
					<a className="text-xl bg-[#e35050] text-white rounded px-4 py-1 whitespace-pre">
						{" Other "}
					</a>
				</div>
				{/* <input placeholder="Search for products" type="text" name="text" className="flex-1 p-2 rounded-md border-[1.5px] border-gray-200 mr-5 active:border-gray-400 "></input> */}
				<div className="flex md:space-x-4 md:mr-5 justify-self-end h-fit md:flex-row flex-col items-center md:gap-y-0 gap-y-3">
					<Link
						className="text-xl bg-[#e35050] text-white rounded px-5 py-1 text-center"
						href={"/contact"}
					>
						Contact
					</Link>
					<Link
						className="text-xl bg-[#e35050] text-white rounded px-3 py-1 text-center"
						href={"/customorder"}
					>
						Custom Order
					</Link>
					<Link href={"/checkout"}>
						{cartNumber !== 0 && <div className="absolute rounded-full bg-white w-5 h-5 text-center translate-x-6 -translate-y-2 text-sm">{cartNumber}</div>}
						<FaShoppingCart className="text-4xl text-black py-1" />
					</Link>
				</div>
			</div>
		</div>
	);
}
