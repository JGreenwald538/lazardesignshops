import Image from "next/image";
import Link from "next/link";

export default function TopBar() {
	return (
		<div className="px-24 pt-8 w-full">
			<div className="w-full rounded-xl border-2 border-black flex flex-row py-5 items-center">
				<Link href={"/"} className="object-scale-down w-[12%] justify-start">
					<Image
						src="/Lazar.Wide.white.png"
						alt=""
						width={4574}
						height={2092}
						className=""
					/>
				</Link>
				<div className="flex-1 flex justify-around">
					<div className="text-xl border-2 border-black rounded-xl px-2 py-1">
						Prints
					</div>
					<div className="text-xl border-2 border-black rounded-xl px-2 py-1">
						Print
					</div>
					<div className="text-xl border-2 border-black rounded-xl px-2 py-1">
						Print
					</div>
					<div className="text-xl border-2 border-black rounded-xl px-2 py-1">
						Print
					</div>
				</div>
				<div className="flex space-x-4 mr-2">
					<Link
						className="text-xl border-2 border-black rounded-xl px-2 py-1"
						href={"/contact"}
					>
						Contact
					</Link>
					<Link
						className="text-xl border-2 border-black rounded-xl px-2 py-1"
						href={"/customorder"}
					>
						Custom Order
					</Link>
				</div>
			</div>
		</div>
	);
}
