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
		<div className="w-full justify-center flex">
			<div className="flex flex-col border-2 border-black p-2 hover:opacity-70 w-80 rounded-md mt-6 items-center mx-auto">
				<Link href={`/product/${productId}`}>
					<Image
						src={imagePath}
						alt=""
						width={2000}
						height={2000}
						className="w-96 object-scale-down"
						unoptimized
						loading="lazy"
					/>
				</Link>
				<div>{displayName}</div>
			</div>
		</div>
	);
}
