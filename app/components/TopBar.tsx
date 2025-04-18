import Image from "next/image";
import Link from "next/link";
import { FaShoppingCart } from "react-icons/fa";

export default function TopBar() {
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
			<div className="w-full rounded border-2 border-black flex md:flex-row flex-col py-5 items-center md:gap-y-0 gap-y-5">
				<div className="flex-1 flex justify-self-start gap-x-5 ml-5">
					<button className="text-xl bg-[#e35050] text-white rounded px-3 py-1 whitespace-pre">
						{" Prints "}
					</button>
					<button className="text-xl bg-[#e35050] text-white rounded px-3 py-1">
						Clothing
					</button>
					<button className="text-xl bg-[#e35050] text-white rounded px-4 py-1 whitespace-pre">
						{" Other "}
					</button>
				</div>
				{/* <input placeholder="Search for products" type="text" name="text" className="flex-1 p-2 rounded-md border-[1.5px] border-gray-200 mr-5 active:border-gray-400 "></input> */}
				<div className="flex space-x-4 mr-5 justify-self-end h-fit">
					<Link
						className="text-xl bg-[#e35050] text-white rounded px-5 py-1"
						href={"/contact"}
					>
						Contact
					</Link>
					<Link
						className="text-xl bg-[#e35050] text-white rounded px-3 py-1"
						href={"/customorder"}
					>
						Custom Order
					</Link>
					<FaShoppingCart className="text-4xl text-black py-1" />
				</div>
			</div>
		</div>
	);
}
