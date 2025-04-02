"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import DropDown from "@/app/components/Dropdown";
import { BiSolidUpArrow, BiSolidDownArrow } from "react-icons/bi";
import TopBar from "@/app/components/TopBar";

interface PrintifyProduct {
	id: string;
	title: string;
	description?: string;
	images?: { src: string }[];
	tags?: string[];
	variants?: {
		id: string;
		title: string;
		price: string;
		sku: string;
		available: boolean;
		options?: { title: string; value: string }[];
	}[];
	created_at?: string;
	updated_at?: string;
	available?: boolean;
	preview_url?: string;
	shop_id?: string;
	print_provider_id?: string;
	blueprint?: {
		id: string;
		title: string;
		preview_url: string;
		created_at: string;
		updated_at: string;
		available: boolean;
		images?: { src: string }[];
	};
	blueprint_id?: string;
	created_by?: string;
	updated_by?: string;
}

export default function ProductPage() {
	const { id } = useParams();
	const [product, setProduct] = useState<PrintifyProduct | null>(null);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);
	const [quantity, setQuantity] = useState<number>(1);

	useEffect(() => {
		if (!id) return;

		fetch(`/api/printify/product/${id}`)
			.then((res) => res.json())
			.then((data) => {
				if (data.error) {
					setError(data.error);
					setLoading(false);
					return;
				}
				setProduct(data);
				setLoading(false);
			})
			.catch((err) => {
				console.error("Failed to fetch product:", err);
				setError("Failed to load product.");
				setLoading(false);
			});
	}, [id]);

	console.log(product);

	return (
		<div>
			<TopBar />
			{loading && <p>Loading product...</p>}
			{error && <p style={{ color: "red" }}>{error}</p>}
			{product && (
				<div
					className="flex justify-start md:flex-row flex-col items-start h-screen mt-4"
				>
					{product.images && product.images.length > 0 && (
						<div className="w-2/5 flex flex-col">
							{product.images.map((image, index) => (
								<Image
									key={index}
									src={image.src}
									alt={product.title}
									width={4000}
									height={4000}
									className="object-scale-down"
								/>
							))}
						</div>
					)}

					<div className="flex flex-col justify-center items-left md:w-1/2 w-full px-4 md:px-0 mt-40 ml-12 gap-y-8">
						<div className="text-4xl font-bold text-left w-full">
							{product.title}
						</div>
						{product.description
							?.split(".:")
							.map((text: string, index: number) => (
								<div key={index.toString()} className="text-start w-full">
									{text}
								</div>
							)) || "No description available"}
						{product.variants && (
							<DropDown
								displayList={product.variants.map((variant) => variant.title)}
								displayName="Types"
							/>
						)}
						<div className="flex flex-row gap-x-2 items-center">
							<div className="text-xl">Quantity: </div>
							<textarea
								// type="number"
								className="border-2 border-black rounded-md p-1 w-fit text-center overflow-hidden resize-none px-2"
								value={quantity}
								onChange={(e) => {
									const val = e.target.value;
									if (val === "" || parseInt(val) < 0) {
										setQuantity(0);
										return;
									}
									if (isNaN(parseInt(val)) || parseInt(val) > 9) return;
									setQuantity(parseInt(val));
								}}
								rows={1}
								cols={1}
							/>
							<div className="flex flex-col">
								<button
									onClick={() => {
										if (quantity == 9) return;
										setQuantity((prev) => prev + 1);
									}}
								>
									<BiSolidUpArrow />
								</button>
								<button
									onClick={() => {
										if (quantity == 1) return;
										setQuantity((prev) => prev - 1);
									}}
								>
									<BiSolidDownArrow />
								</button>
							</div>
						</div>
						<div className="text-xl">
							Estimated Shipping Time: 3-5 days
						</div>
						<div className="flex flex-row gap-x-4">
							<button className="bg-black text-white px-4 py-2 rounded-md">
								Add to Cart
							</button>
							<button className="bg-black text-white px-4 py-2 rounded-md">
								Buy Now
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
