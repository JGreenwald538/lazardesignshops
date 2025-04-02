import Image from "next/image";
import Link from "next/link";

export default function TopBar() {
	return (
		<div className="md:px-24 px-10 pt-8 w-full">
			<div className="w-full rounded-xl border-2 border-black flex md:flex-row flex-col py-5 items-center md:gap-y-0 gap-y-5">
				<Link
					href={"/"}
					className="object-scale-down md:w-[12%] w-1/2 justify-start"
				>
					<Image
						src="/Lazar.Wide.white.png"
						alt=""
						width={4574}
						height={2092}
						className=""
					/>
				</Link>
				<div className="flex-1 flex justify-around gap-x-5">
					<button className="text-xl border-2 border-[#3b2abf] bg-[#3b2abf] text-white rounded px-2 py-1">
						Prints
					</button>
					<button className="text-xl border-2 border-[#3b2abf] bg-[#3b2abf] text-white rounded px-2 py-1">
						Clothing
					</button>
					<button className="text-xl border-2 border-[#3b2abf] bg-[#3b2abf] text-white rounded px-2 py-1">
						Other
					</button>
				</div>
				<div className="flex space-x-4 mr-2">
					<Link
						className="text-xl border-2 border-[#3b2abf] bg-[#3b2abf] text-white rounded px-2 py-1"
						href={"/contact"}
					>
						Contact
					</Link>
					<Link
						className="text-xl border-2 border-[#3b2abf] bg-[#3b2abf] text-white rounded px-2 py-1"
						href={"/customorder"}
					>
						Custom Order
					</Link>
				</div>
			</div>
		</div>
	);
}
