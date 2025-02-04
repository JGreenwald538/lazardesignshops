import Image from "next/image";

export default function ShopItem() {
	return (
		<div className="w-full justify-center flex">
			<div className="flex flex-col border-2 border-black p-2 hover:opacity-70 w-fit rounded-md mt-6 items-center">
				<Image
					src="/atlantis copy.jpg"
					alt=""
					width={2000}
					height={2000}
					className="w-96 object-scale-down"
				/>
				<div>Atlantis Poster</div>
			</div>
		</div>
	);
}
