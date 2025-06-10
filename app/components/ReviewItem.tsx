"use client";

import Image from "next/image";
import { RemoveItem, SetItemQuantity } from "../utils/Cart";
import { TiArrowSortedDown, TiArrowSortedUp } from "react-icons/ti";
import { BsTrash3 } from "react-icons/bs";

export default function ReviewItem({
	item,
	index,
}: {
	item: {
		variantID: number;
		price: number;
		quantity: number;
		name: string;
		id: string;
		images: string[];
	};
	index: number;
}) {
	return (
		<div
			key={index}
			className="p-4 flex lg:flex-row flex-col items-center rounded-md shadow m-1 bg-white lg:space-y-0 space-y-4"
		>
			<div className="flex flex-row items-center space-x-4 basis-1/2">
				<Image
					src={item.images[0]}
					alt={item.name}
					width={400}
					height={400}
					className="w-32 h-32 object-cover"
				/>
				<h2 className="text-xl font-bold basis-36">{item.name}</h2>
			</div>
			<div className="flex flex-row items-center justify-between w-full">
				<div className="flex flex-row space-x-4 justify-center basis-28">
					<div>{item.quantity}</div>
					<div className="flex flex-col">
						<button
							onClick={async () => {
								SetItemQuantity(item.variantID, item.quantity + 1);
							}}
						>
							<TiArrowSortedUp />
						</button>
						<button
							onClick={async () => {
								if (item.quantity <= 1) {
									if (
										window.confirm("Are you sure you want to remove this item?")
									) {
										await RemoveItem(item.variantID);
									}
								} else {
									SetItemQuantity(item.variantID, item.quantity - 1);
								}
							}}
						>
							<TiArrowSortedDown />
						</button>
					</div>
				</div>
				<p className="basis-48 justify-center flex">${item.price}</p>
				<button
					onClick={async () => {
						if (window.confirm("Are you sure you want to remove this item?")) {
							await RemoveItem(item.variantID);
						}
					}}
					className="text-2xl basis-12 flex justify-center"
				>
					<BsTrash3 />
				</button>
			</div>
		</div>
	);
}
