import Image from "next/image";
import Link from "next/link";

export default function ShopItem({
	displayName,
	productId,
	imagePath,
}: {
	displayName: string;
	productId: string;
	imagePath: string;
}) {
	return (
		<div className="md:w-fit w-full justify-center justify-self-center flex group">
			<Link
				className="flex flex-col p-2 w-80 rounded-md mt-6 items-center mx-auto"
				href={`/product/${productId}`}
			>
				<Image
					src={imagePath}
					alt=""
					width={2000}
					height={2000}
					className="w-96 object-scale-down group-hover:scale-105 transition-all duration-500"
					unoptimized
					loading="lazy"
				/>
				<div className="border-2 border-[#383531] rounded w-full text-center mt-2 hover group-hover:bg-[#383531] group-hover:text-white transition-all duration-500">
					{displayName}
				</div>
			</Link>
		</div>
	);
}
