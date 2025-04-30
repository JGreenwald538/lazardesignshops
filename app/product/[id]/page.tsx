"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import DropDown from "@/app/components/Dropdown";
import { BiSolidUpArrow, BiSolidDownArrow } from "react-icons/bi";
import TopBar from "@/app/components/TopBar";
import {
	isValidPrintifyProduct,
	PrintifyProduct,
} from "@/app/utils/PrintifyProduct";
import { SiZebpay } from "react-icons/si";

export default function ProductPage() {
	const { id } = useParams();
	const [product, setProduct] = useState<PrintifyProduct | null>(null);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);
	const [quantity, setQuantity] = useState<number>(1);
	const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);
	const [size, setSize] = useState("");
	const [color, setColor] = useState("");

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
				if (!isValidPrintifyProduct(data)) console.error("Data is not valid");
				setProduct(data);
				setLoading(false);
			})
			.catch((err) => {
				console.error("Failed to fetch product:", err);
				setError("Failed to load product.");
				setLoading(false);
			});
	}, [id]);

	console.log(
		product?.prices.find((price) => {
			console.log();
			return price.size === size;
		})
	);

	return (
		<div className="flex flex-col min-h-screen overflow-x-hidden">
			<TopBar />
			<div className="flex-grow flex items-center justify-center w-full">
				{loading && <p>Loading product...</p>}
				{error && <p style={{ color: "red" }}>{error}</p>}
				{product && (
					<div className="flex md:flex-row flex-col items-center justify-center mt-4 w-full max-w-7xl">
						{product.images && product.images.length > 0 && (
							<div className="md:w-2/5 w-full max-w-md flex flex-col items-center gap-4 md:mb-0 mb-8">
								{/* Main Image Display */}
								<div className="w-full relative">
									<Image
										src={product.images[selectedImageIndex]}
										alt={`${product.title} - view ${selectedImageIndex + 1}`}
										width={4000}
										height={4000}
										className="object-contain w-full h-auto"
									/>
								</div>

								{/* Thumbnail Gallery */}
								<div className="flex flex-row flex-wrap gap-2 justify-center">
									{product.images.map((image, index) => (
										<div
											key={index}
											className={`cursor-pointer relative transition-all ${
												selectedImageIndex === index
													? "border-black"
													: "border-gray-200"
											}`}
											onClick={() => setSelectedImageIndex(index)}
										>
											<Image
												src={image}
												alt={`${product.title} thumbnail ${index + 1}`}
												width={80}
												height={80}
												className="object-cover w-16 h-16"
											/>
										</div>
									))}
								</div>
							</div>
						)}

						<div className="flex flex-col justify-center md:w-1/2 w-full md:pl-8 max-w-xl gap-y-6 md:px-0 px-4">
							<h1 className="text-3xl md:text-4xl font-bold text-left w-full break-words">
								{product.title}
							</h1>
							{product.description ? (
								<div className="w-full">
									{product.description
										.split(".:")
										.map((text: string, index: number) => (
											<p
												key={index.toString()}
												className="text-start w-full break-words mb-2"
											>
												{text.trim()}
											</p>
										))}
								</div>
							) : (
								<p className="text-start w-full">No description available</p>
							)}

							<DropDown
								displayList={product.prices
									.filter((price) => price.price)
									.map((price) => price.size)}
								displayName={size || "Sizes"}
								setType={setSize}
							/>

							{product.colors && (
								<DropDown
									displayList={product.colors}
									displayName={color || "Colors"}
									setType={setColor}
								/>
							)}

							<div className="text-xl">
								{"Price: " +
									(product.prices.find((price) => {
										return price.size === size;
									})
										? "$" +
										  product.prices.find((price) => {
												return price.size === size;
										  })?.price
										: "Select Size to find Price")}
							</div>

							<div className="flex flex-row gap-x-2 items-center">
								<div className="text-xl">Quantity: </div>
								<textarea
									className="border-2 border-black rounded-md p-1 w-10 text-center overflow-hidden resize-none"
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
							<div className="text-xl">Estimated Shipping Time: 3-5 days</div>
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
		</div>
	);
}
