"use client";

import { useEffect, useRef, useState } from "react";
import ShopItem from "./components/ShopItem";
import TopBar from "./components/TopBar";
import Filter from "./components/Filter";
import SortBy from "./components/SortBy";
import TickerComponent from "./components/Ticker";
import PopularItem from "./components/PopularItem";
import { useSearchParams } from "next/navigation";

interface PrintifyProduct {
	id: string;
	title: string;
	images: string[];
}

export default function Home() {
	const [products, setProducts] = useState<PrintifyProduct[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const searchParams = useSearchParams();
	const filterType = searchParams.get("f");
	const itemsRef = useRef<HTMLDivElement>(null);

	// Fetch products
	useEffect(() => {
		const fetchInitialProducts = async () => {
			setIsLoading(true);
			let posters: PrintifyProduct[] = [];
			let tshirts: PrintifyProduct[] = [];

			try {
				const res = await fetch("/api/database/tshirts");
				const data = await res.json();
				if (data.error) throw new Error(data.error);
				tshirts = data;
			} catch (error) {
				console.error("Error fetching tshirts:", error);
			}

			try {
				const res = await fetch("/api/database/posters");
				const data = await res.json();
				if (data.error) throw new Error(data.error);
				posters = data;
			} catch (error) {
				console.error("Error fetching posters:", error);
			}

			let allProducts: PrintifyProduct[] = [];

			if (filterType === "posters") {
				allProducts.push(...posters);
			} else if (filterType === "tshirts") {
				allProducts.push(...tshirts);
			} else {
				allProducts.push(...posters);
				allProducts.push(...tshirts);
			}

			// Randomize product order
			allProducts = allProducts.sort(() => Math.random() - 0.5);
			setProducts(allProducts);
			setIsLoading(false);
		};

		fetchInitialProducts();
	}, [filterType]); // Add filterType as dependency

	// Handle scrolling after products are loaded and rendered
	useEffect(() => {
		if (
			!isLoading &&
			products.length > 0 &&
			itemsRef.current &&
			(filterType === "posters" || filterType === "tshirts")
		) {
			// Slight delay to ensure DOM is fully updated
			setTimeout(() => {
				itemsRef.current?.scrollIntoView({
					behavior: "smooth",
					block: "start",
				});
			}, 0);
		}
	}, [isLoading, products, filterType]);

	return (
		<div className="w-full max-w-full overflow-x-hidden flex flex-col justify-center items-center">
			<TopBar />
			<TickerComponent />
			<div className="flex flex-row w-full max-w-4xl px-4 p-2 md:my-4 my-0 rounded-xl justify-between">
				<Filter />
				<SortBy />
			</div>
			<div className="flex md:flex-row flex-col p-2 md:my-4 my-0 rounded-xl md:justify-around justify-center gap-x-8 gap-y-4 w-full">
				<PopularItem
					displayName="Posters"
					imagePath="/postersImage.jpg"
					filterType="posters"
				/>
				<PopularItem
					displayName="T-Shirts"
					imagePath="/LazarDesign.banner.png"
					filterType="tshirts"
				/>
			</div>
			<div
				id="product-grid"
				className="grid xl:grid-cols-3 lg:grid-cols-2 grid-cols-1 gap-8 w-full max-w-6xl px-4 items-center justify-center mb-6 mx-auto"
				ref={itemsRef}
			>
				{isLoading ? (
					<div className="col-span-full text-center py-8">
						Loading products...
					</div>
				) : products.length === 0 ? (
					<div className="col-span-full text-center py-8">
						No products found
					</div>
				) : (
					products.map((product) => (
						<ShopItem
							key={product.id}
							displayName={product.title.split("|")[0]}
							productId={product.id}
							imagePath={product.images[0] || "/placeholder.jpg"}
						/>
					))
				)}
			</div>
		</div>
	);
}
