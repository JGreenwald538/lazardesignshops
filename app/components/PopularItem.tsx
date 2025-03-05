import Image from "next/image";
import Link from "next/link";

export default function ShopItem({
	displayName,
	imagePath,
}: {
	displayName: string;
	imagePath: string;
}) {
	return (
		<div className="w-full justify-center flex">
			<Link
				className="flex flex-col border-2 border-black p-2 hover:opacity-70 w-[30rem] rounded-md mt-6 items-center mx-auto"
				href={`/`}
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
