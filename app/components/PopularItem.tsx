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
		<div className="w-full justify-center flex">
			<Link
				className="flex flex-col p-2 hover:opacity-70 md:w-[30rem] w-full rounded-md mt-6 items-center md:mx-auto mx-10"
				href={`/?f=${filterType}#items`}
			>
				<Image
					src={imagePath}
					alt=""
					width={2000}
					height={2000}
					className="w-96 object-scale-down"
					unoptimized
					loading="lazy"
				/>
				<div className="text-3xl font-bold">{displayName}</div>
			</Link>
		</div>
	);
}
