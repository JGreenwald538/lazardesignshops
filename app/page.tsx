"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
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
	const [posters, setPosters] = useState<PrintifyProduct[]>([]);
	const [tshirts, setTshirts] = useState<PrintifyProduct[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const searchParams = useSearchParams();
	const filterType = searchParams.get("f");
	const sortByType = searchParams.get("s");
	const itemsRef = useRef<HTMLDivElement>(null);

	// Fetch products
	useEffect(() => {
		const fetchInitialProducts = async () => {
			setIsLoading(true);
			let fetchedPosters: PrintifyProduct[] = [];
			let fetchedTshirts: PrintifyProduct[] = [];

			try {
				const res = await fetch("/api/database/tshirts");
				const data = await res.json();
				if (data.error) throw new Error(data.error);
				fetchedTshirts = data;
			} catch (error) {
				console.error("Error fetching tshirts:", error);
			}

			try {
				const res = await fetch("/api/database/posters");
				const data = await res.json();
				if (data.error) throw new Error(data.error);
				fetchedPosters = data;
			} catch (error) {
				console.error("Error fetching posters:", error);
			}

			setPosters(fetchedPosters);
			setTshirts(fetchedTshirts);
			setIsLoading(false);
		};

		fetchInitialProducts();
	}, []);

	const products = useMemo(() => {
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

		return allProducts;
	}, [filterType, posters, sortByType, tshirts]);

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
			id="items"
			className="mx-auto mb-6 grid w-full max-w-6xl grid-cols-1 items-stretch justify-center gap-5 px-4 sm:gap-8 lg:grid-cols-2 xl:grid-cols-3"
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
						badgeLabel={product.product_type === "poster" ? "Poster" : "T-Shirt"}
						priceLabel={
								product.prices.some((price) => price.price !== null)
									? `From $${Math.min(
										...product.prices
											.map((price) => price.price)
											.filter((price): price is number => price !== null),
									)}`
								: "Price available on product page"
						}
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
		<div className="w-full max-w-full overflow-x-hidden flex flex-col items-center pb-16">
			<TopBar />
			<TickerComponent />
			<section className="mx-auto w-full max-w-7xl px-4 py-6 lg:py-12">
				<div className="glass-panel rounded-3xl p-4 sm:rounded-4xl sm:p-5">
					<div className="text-[11px] uppercase tracking-[0.28em] text-[#7a716a] sm:text-xs sm:tracking-[0.35em]">
						What sells
					</div>
					<div className="mt-2 text-2xl font-semibold leading-tight text-[#141110] sm:text-3xl">
						Best-selling formats
					</div>
					<div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
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
				</div>
			</section>

			<div className="glass-panel relative z-[900] mx-auto mb-5 flex w-[calc(100%-2rem)] max-w-7xl flex-col items-stretch justify-between gap-4 rounded-3xl px-4 py-4 sm:w-full sm:flex-row sm:flex-wrap sm:items-center sm:px-6">
				<div>
					<div className="text-[11px] uppercase tracking-[0.28em] text-[#7a716a] sm:text-xs sm:tracking-[0.35em]">
						Shop catalog
					</div>
					<div className="text-2xl font-semibold leading-tight text-[#141110] sm:text-3xl">
						Find the piece that fits
					</div>
				</div>
				<div className="grid grid-cols-2 gap-3 sm:flex sm:flex-wrap">
					<Filter />
					<SortBy />
				</div>
			</div>
			<Suspense fallback={<div className="text-center py-8">Loading...</div>}>
				<ProductsWithSearch />
			</Suspense>
		</div>
	);
}
