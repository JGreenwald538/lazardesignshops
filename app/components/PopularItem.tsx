import Image from "next/image";
import Link from "next/link";

export default function ShopItem({
	displayName,
	imagePath,
	filterType
}: {
	displayName: string;
	imagePath: string;
	filterType: string;
}) {
	return (
		<div className="justify-center flex">
			<Link
				className="flex flex-col p-2 hover:opacity-70 rounded-md mt-6 items-center md:mx-auto"
				href={`/?f=${filterType}#items`}
			>
				<Image
					src={imagePath}
					alt={displayName + " image"}
					width={2000}
					height={2000}
					className="w-96 object-scale-down"
					priority
				/>
				<div className="text-3xl font-bold">{displayName}</div>
			</Link>
		</div>
	);
}
