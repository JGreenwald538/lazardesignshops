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
		<div className="lg:px-24 px-10 pt-8 w-full flex lg:flex-row flex-col justify-between items-center lg:space-y-0 space-y-5">
			<Link
				href={"/"}
				className="object-scale-down lg:w-[12%] w-1/2 justify-start mr-4"
			>
				<Image
					src="/Lazar.Wide.white.png"
					alt=""
					width={4574}
					height={2092}
					className=""
				/>
			</Link>
			<div className="lg:w-full lg:px-0 px-5 rounded flex lg:flex-row flex-col py-5 items-center lg:gap-y-0 gap-y-5">
				<div className="flex-1 flex justify-self-start lg:gap-x-5 lg:ml-5 lg:flex-row flex-col lg:gap-y-0 gap-y-3">
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
				<div className="flex lg:space-x-4 lg:mr-5 justify-self-end h-fit lg:flex-row flex-col items-center lg:gap-y-0 gap-y-3">
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
					<Link href={"/checkout/review"}>
						{cartNumber !== 0 && <div className="absolute rounded-full bg-white w-5 h-5 text-center translate-x-6 -translate-y-2 text-sm">{cartNumber}</div>}
						<FaShoppingCart className="text-4xl text-black py-1" />
					</Link>
				</div>
			</div>
		</div>
	);
}
