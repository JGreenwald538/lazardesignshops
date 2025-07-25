"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import ShopItem from "./components/ShopItem";
import TopBar from "./components/TopBar";
import Filter from "./components/Filter";
import SortBy from "./components/SortBy";
import TickerComponent from "./components/Ticker";
import PopularItem from "./components/PopularItem";
import { useSearchParams } from "next/navigation";
import { PrintifyProduct } from "./utils/PrintifyProduct";

// Create a separate component that uses useSearchParams
function ProductsGrid() {
	const [products, setProducts] = useState<PrintifyProduct[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const searchParams = useSearchParams();
	const filterType = searchParams.get("f");
	const sortByType = searchParams.get("s");
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

			if (sortByType === "priceasec") {
				allProducts.sort((product1, product2) => {
					const price1 = product1.prices[0]?.price || 0;
					const price2 = product2.prices[0]?.price || 0;
					return price1 - price2;
				});
			} else if (sortByType === "pricedesc") {
				allProducts.sort((product1, product2) => {
					const price1 = product1.prices[0]?.price || 0;
					const price2 = product2.prices[0]?.price || 0;
					return price2 - price1;
				});
			} else if (sortByType === "alphaasec") {
				allProducts.sort((product1, product2) => {
					const name1 = product1.title || "";
					const name2 = product2.title || "";
					return name1.localeCompare(name2);
				});
			} else if (sortByType === "alphadesc") {
				allProducts.sort((product1, product2) => {
					const name1 = product1.title || "";
					const name2 = product2.title || "";
					return name2.localeCompare(name1);
				});
			} else if (sortByType === "releaseasec") {
				allProducts.sort((product1, product2) => {
					const date1 = product1.created_at || "";
					const date2 = product2.created_at || "";
					return date2.localeCompare(date1);
				});
			} else if (sortByType === "releasedesc") {
				allProducts.sort((product1, product2) => {
					const date1 = product1.created_at || "";
					const date2 = product2.created_at || "";
					return date1.localeCompare(date2);
				});
			} else {
				allProducts = allProducts.sort(() => Math.random() - 0.5);
			}

			setProducts(allProducts);
			setIsLoading(false);
		};

		fetchInitialProducts();
	}, [filterType, sortByType]); // Added sortByType to dependency array

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
				<div className="col-span-full text-center py-8">No products found</div>
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
	);
}

// Client Component that uses useSearchParams
function ProductsWithSearch() {
	return <ProductsGrid />;
}

// Main page component
export default function Home() {
	return (
		<div className="w-full max-w-full overflow-x-hidden flex flex-col justify-center items-center">
			<TopBar />
			<TickerComponent />
			<div className="flex flex-row w-full max-w-4xl px-4 p-2 lg:my-4 my-0 rounded-xl justify-between">
				<Filter />
				<SortBy />
			</div>
			<div className="flex lg:flex-row flex-col p-2 lg:my-4 my-0 rounded-xl justify-center gap-x-72 gap-y-4 w-full">
				<PopularItem
					displayName="Posters"
					imagePath="/chromaposter mock.png"
					filterType="posters"
				/>
				<PopularItem
					displayName="T-Shirts"
					imagePath="/passionshirt mock.png"
					filterType="tshirts"
				/>
			</div>
			<Suspense fallback={<div className="text-center py-8">Loading...</div>}>
				<ProductsWithSearch />
			</Suspense>
		</div>
	);
}
