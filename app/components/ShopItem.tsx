import Image from "next/image";
import Link from "next/link";

export default function ShopItem({
	displayName,
	productId,
	imagePath,
	priceLabel,
	badgeLabel,
}: {
	displayName: string;
	productId: string;
	imagePath: string;
	priceLabel: string;
	badgeLabel: string;
}) {
	return (
		<div className="flex w-full justify-center justify-self-center md:w-fit group">
			<Link
				className="glass-panel store-button flex w-full max-w-sm flex-col overflow-hidden rounded-3xl p-3 text-left shadow-[0_24px_70px_rgba(20,17,16,0.09)]"
				href={`/product/${productId}`}
			>
				<div className="relative overflow-hidden rounded-[1.35rem] bg-[#f6efe6] sm:rounded-[1.5rem]">
					<Image
						src={imagePath}
						alt={displayName}
						width={2000}
						height={2000}
						className="h-auto w-full object-contain transition duration-500 group-hover:scale-[1.03]"
						unoptimized
						loading="lazy"
					/>
					<div className="absolute left-4 top-4 rounded-full bg-[#141110]/90 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-white">
						{badgeLabel}
					</div>
				</div>
				<div className="flex flex-1 flex-col gap-3 px-2 py-4">
					<div>
						<div className="text-[10px] uppercase tracking-[0.22em] text-[#7a716a] sm:text-[11px] sm:tracking-[0.28em]">
							Limited selection
						</div>
						<div className="display-font text-2xl leading-none text-[#141110] sm:text-3xl">
							{displayName}
						</div>
					</div>
					<div className="flex flex-wrap items-center justify-between gap-2 text-sm text-[#6a625d]">
						<span>{priceLabel}</span>
						<span className="font-semibold text-[#d15b43]">View piece</span>
					</div>
				</div>
			</Link>
		</div>
	);
}
