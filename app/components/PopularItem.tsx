import Image from "next/image";
import Link from "next/link";

export default function ShopItem({
	displayName,
	imagePath,
	filterType,
}: {
	displayName: string;
	imagePath: string;
	filterType: string;
}) {
	return (
		<div className="w-full justify-center flex">
			<Link
				className="glass-panel store-button group relative flex w-full max-w-md flex-col overflow-hidden rounded-3xl p-3 md:mx-auto"
				href={`/?f=${filterType}#items`}
			>
				<div className="relative aspect-[4/5] overflow-hidden rounded-[1.35rem] bg-[#f6efe6] sm:rounded-[1.5rem]">
					<Image
						src={imagePath}
						alt={displayName + " image"}
						width={2000}
						height={2000}
						className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
						priority
					/>
					<div className="absolute inset-0 bg-gradient-to-t from-[#141110]/70 via-transparent to-transparent" />
					<div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-3 text-white">
						<div className="min-w-0">
							<div className="text-[10px] uppercase tracking-[0.24em] text-white/80 sm:text-[11px] sm:tracking-[0.3em]">
								Featured category
							</div>
							<div className="display-font text-3xl leading-none sm:text-4xl">
								{displayName}
							</div>
						</div>
						<div className="shrink-0 rounded-full border border-white/30 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] sm:text-sm sm:tracking-[0.18em]">
							Explore
						</div>
					</div>
				</div>
			</Link>
		</div>
	);
}
