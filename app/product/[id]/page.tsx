"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { BiSolidDownArrow, BiSolidUpArrow } from "react-icons/bi";
import DropDown from "@/app/components/Dropdown";
import TopBar from "@/app/components/TopBar";
import { AddToCart } from "@/app/utils/Cart";
import {
	isValidPrintifyProduct,
	PrintifyProduct,
} from "@/app/utils/PrintifyProduct";

type ColorRecord = {
	name: string;
	hex: string;
};

export default function ProductPage() {
	const { id } = useParams();
	const [product, setProduct] = useState<PrintifyProduct | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [quantity, setQuantity] = useState(1);
	const [selectedImageIndex, setSelectedImageIndex] = useState(0);
	const [size, setSize] = useState("");
	const [color, setColor] = useState("");
	const [variantID, setVariantID] = useState(0);
	const [addToCartPressed, setAddToCartPressed] = useState(false);
	const [colorMap, setColorMap] = useState<Record<string, string>>({});
	const [descriptionExpanded, setDescriptionExpanded] = useState(false);
	const [descriptionCanExpand, setDescriptionCanExpand] = useState(false);
	const descriptionRef = useRef<HTMLDivElement>(null);

	const resolveVariantID = useCallback(
		async (
			selectedSize: string,
			selectedColor: string,
			throwOnError = true,
		) => {
			if (!id || !product) return 0;

			if (product.product_type === "poster") {
				if (!selectedSize) return 0;
			} else if (!selectedSize || !selectedColor) {
				return 0;
			}

			const response = await fetch("/api/printify/find-variant", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					size: selectedSize,
					id,
					...(product.product_type === "tshirt" ? { color: selectedColor } : {}),
				}),
			});

			const responseText = await response.text();
			let data: { variantId?: number; error?: string } = {};

			if (responseText) {
				try {
					data = JSON.parse(responseText) as {
						variantId?: number;
						error?: string;
					};
				} catch {
					data = { error: "Variant lookup returned an invalid response" };
				}
			}

			if (!response.ok) {
				if (throwOnError) {
					throw new Error(data.error || "Failed to look up product variant");
				}
				return 0;
			}

			return data.variantId || 0;
		},
		[id, product],
	);

	useEffect(() => {
		if (!id) return;

		fetch(`/api/database/product/${id}`)
			.then((res) => res.json())
			.then((data) => {
				if (data.error) {
					setError(data.error);
					setLoading(false);
					return;
				}
				if (!isValidPrintifyProduct(data)) console.error("Data is not valid");
				setDescriptionExpanded(false);
				setProduct(data);
				if (data?.colors?.length === 1) {
					setColor(data.colors[0]);
				}
				setLoading(false);
			})
			.catch((err) => {
				console.error("Failed to fetch product:", err);
				setError("Failed to load product.");
				setLoading(false);
			});
	}, [id]);

	useEffect(() => {
		const descriptionElement = descriptionRef.current;
		if (!descriptionElement || !product?.description) {
			requestAnimationFrame(() => setDescriptionCanExpand(false));
			return;
		}

		if (descriptionExpanded) return;

		const animationFrame = requestAnimationFrame(() => {
			setDescriptionCanExpand(
				descriptionElement.scrollHeight > descriptionElement.clientHeight + 1,
			);
		});

		return () => cancelAnimationFrame(animationFrame);
	}, [product?.description, descriptionExpanded]);

	useEffect(() => {
		fetch("/api/database/colors")
			.then((res) => res.json())
			.then((data: ColorRecord[] | { error?: string }) => {
				if (Array.isArray(data)) {
					setColorMap(
						data.reduce<Record<string, string>>((accumulator, colorItem) => {
							accumulator[colorItem.name] = colorItem.hex;
							return accumulator;
						}, {}),
					);
				}
			})
			.catch((fetchError) => {
				console.error("Failed to fetch colors:", fetchError);
			});
	}, []);

	useEffect(() => {
		if (!product) return;

		resolveVariantID(size, color, false)
			.then((resolvedVariantID) => {
				setVariantID(resolvedVariantID);
			})
			.catch(() => {
				setVariantID(0);
			});
	}, [color, size, id, product, resolveVariantID]);

	const handleAddToCart = async (images: string[]) => {
		if (!product) return;

		if (!size) {
			alert("Must select size before adding to cart");
			return;
		}

		if (product.product_type === "tshirt" && !color) {
			alert("Must select color before adding to cart");
			return;
		}

		let resolvedVariantID = variantID;
		if (!resolvedVariantID) {
			try {
				resolvedVariantID = await resolveVariantID(size, color, true);
			} catch (resolveError) {
				const errorMessage =
					resolveError instanceof Error
						? resolveError.message
						: "Failed to look up product variant";
				alert(errorMessage);
				return;
			}
		}

		if (!resolvedVariantID) {
			alert("Could not find a matching size/color variant for this product");
			return;
		}

		setVariantID(resolvedVariantID);
		setAddToCartPressed(true);
		setTimeout(() => setAddToCartPressed(false), 1500);

		const response = await AddToCart(
			resolvedVariantID,
			quantity,
			product.prices.find((price) => price.size === size)?.price || 0,
			product.title,
			product.id,
			images,
		);
		if (response) {
			alert(response);
		}
	};

	if (loading) {
		return (
			<div className="flex min-h-screen flex-col overflow-x-hidden">
				<TopBar />
				<div className="mx-auto flex w-full max-w-7xl grow items-center justify-center px-4 py-8">
					<p>Loading product...</p>
				</div>
			</div>
		);
	}

	return (
		<div className="flex min-h-screen flex-col overflow-x-hidden pb-10">
			<TopBar />
			<div className="mx-auto flex w-full max-w-7xl grow items-center justify-center px-4 pb-8 pt-6 lg:px-6">
				{error && <p className="text-[#b04a37]">{error}</p>}
				{product && (
					<div className="glass-panel grid w-full gap-8 rounded-[2.5rem] p-5 md:grid-cols-[minmax(18rem,0.9fr)_minmax(0,1.1fr)] md:p-8 lg:p-10">
						{product.images && product.images.length > 0 && (
							<div className="flex w-full min-w-0 flex-col gap-4 md:min-w-[18rem]">
								<div className="relative aspect-square w-full overflow-hidden rounded-4xl bg-[#f6efe6]">
									<Image
										src={product.images[selectedImageIndex]}
										alt={`${product.title} - view ${selectedImageIndex + 1}`}
										fill
										sizes="(min-width: 1024px) 42vw, (min-width: 768px) 45vw, 100vw"
										className="object-contain p-3 sm:p-4"
										priority
									/>
								</div>

								<div className="flex flex-wrap justify-center gap-2">
									{product.images.map((image, index) => (
										<button
											key={index}
											type="button"
											className={`overflow-hidden rounded-2xl border-2 bg-white transition ${
												selectedImageIndex === index
													? "border-[#141110]"
													: "border-[#141110]/10 opacity-80 hover:opacity-100"
											}`}
											onClick={() => setSelectedImageIndex(index)}
										>
											<Image
												src={image}
												alt={`${product.title} thumbnail ${index + 1}`}
												width={96}
												height={96}
												className="h-14 w-14 object-contain p-1 sm:h-16 sm:w-16"
												unoptimized
											/>
										</button>
									))}
								</div>
							</div>
						)}

						<div className="flex min-w-0 flex-col justify-center gap-6 rounded-4xl bg-white/55 p-4 sm:p-6 lg:p-8">
							<div>
								<div className="mb-3 inline-flex rounded-full border border-[#141110]/10 bg-[#141110] px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-white">
									{product.product_type === "poster" ? "Poster" : "T-Shirt"}
								</div>
								<h1 className="display-font w-full text-4xl leading-tight text-[#141110] md:text-6xl">
									{product.title}
								</h1>
							</div>

							<div>
								{product.description ? (
									<>
										<div
											ref={descriptionRef}
											className={`space-y-3 text-[#5f5650] leading-relaxed ${
												descriptionExpanded
													? ""
													: "product-description-preview"
											}`}
										>
											{product.description
												.split(".: ")
												.map((text: string, index: number) => (
													<p
														key={index.toString()}
														className="w-full wrap-break-word"
													>
														{text.trim()}
													</p>
												))}
										</div>
										{descriptionCanExpand && (
											<button
												type="button"
												className="mt-3 text-sm font-semibold uppercase tracking-[0.18em] text-[#d15b43] transition hover:text-[#141110]"
												onClick={() =>
													setDescriptionExpanded((current) => !current)
												}
											>
												{descriptionExpanded ? "Show less" : "Show more"}
											</button>
										)}
									</>
								) : (
									<p className="text-[#5f5650]">No description available</p>
								)}
							</div>

							<div className="flex flex-wrap items-center gap-3">
								<DropDown
									displayList={product.prices
										.filter((price) => price.price !== null)
										.map((price) => price.size)}
									displayName={size || "Select size"}
									setType={setSize}
								/>
								{color && (
									<div className="rounded-full border border-[#141110]/10 bg-white px-4 py-2 text-sm font-semibold text-[#141110]">
										{color}
									</div>
								)}
							</div>

							{product.colors && product.colors.length !== 0 && (
								<div className="flex flex-wrap gap-3">
									{product.colors.map((buttonColor, index) => {
										if (buttonColor in colorMap) {
											return (
												<button
													key={index}
													type="button"
													className={`rounded-full border p-1 transition duration-200 hover:scale-110 hover:border-[#d15b43] hover:shadow-[0_0_0_3px_rgba(209,91,67,0.2)] ${
														color === buttonColor
															? "scale-110 border-[#d15b43] shadow-[0_0_0_3px_rgba(209,91,67,0.2)]"
															: "border-[#141110]/20"
													}`}
													onClick={() => setColor(buttonColor)}
													aria-label={buttonColor}
													aria-pressed={color === buttonColor}
												>
													<span
														className="block h-7 w-7 rounded-full border border-white/70"
														style={{ backgroundColor: colorMap[buttonColor] }}
													/>
												</button>
											);
										}
										return null;
									})}
								</div>
							)}

							<div className="rounded-3xl border border-[#141110]/10 bg-white px-5 py-4 shadow-[0_8px_20px_rgba(20,17,16,0.06)]">
								<div className="text-xs font-semibold uppercase tracking-[0.3em] text-[#7a716a]">PRICE</div>
								<div className="mt-1 text-4xl font-bold text-[#141110]">
									{product.prices.find((price) => price.size === size)
										? `$${product.prices.find((price) => price.size === size)?.price}`
										: "Select a size"}
								</div>
								<div className="mt-1 text-sm font-medium text-[#5f5650]">
									Estimated shipping time: 3-5 days
								</div>
							</div>

							<div className="flex items-center gap-3">
								<div className="text-sm font-semibold uppercase tracking-[0.28em] text-[#7a716a]">
									Quantity
								</div>
								<div className="flex items-center gap-2 rounded-full border border-[#141110]/10 bg-white px-3 py-2">
									<textarea
										className="h-9 w-10 resize-none bg-transparent text-center text-lg font-semibold text-[#141110] outline-none"
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
									<div className="flex flex-col text-[#7a716a]">
										<button
											type="button"
											onClick={() => {
											if (quantity == 9) return;
											setQuantity((prev) => prev + 1);
										}}
										>
											<BiSolidUpArrow />
										</button>
										<button
											type="button"
											onClick={() => {
											if (quantity == 1) return;
											setQuantity((prev) => prev - 1);
										}}
										>
											<BiSolidDownArrow />
										</button>
									</div>
								</div>
							</div>

							<div className="flex flex-wrap gap-3">
								<button
									className="store-button rounded-full bg-[#141110] px-6 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-white shadow-lg shadow-[#141110]/15"
									onClick={async () => {
										await handleAddToCart([product.images[0]]);
									}}
								>
									{addToCartPressed ? "Added!" : "Add to Cart"}
								</button>
								<Link
									className="store-button rounded-full border border-[#141110]/10 bg-white/80 px-6 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-[#141110]"
									onClick={async () => {
										await handleAddToCart(product.images);
									}}
									href="/checkout/review"
								>
									Buy Now
								</Link>
							</div>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
