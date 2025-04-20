"use client";

import { useEffect, useState } from "react";
import ShopItem from "./components/ShopItem";
import TopBar from "./components/TopBar";
import Filter from "./components/Filter";
import SortBy from "./components/SortBy";
import TickerComponent from "./components/Ticker";
import PopularItem from "./components/PopularItem";

interface PrintifyProduct {
	id: string;
	title: string;
	images: string[];
}

export default function Home() {
	const [products, setProducts] = useState<PrintifyProduct[]>([]);

	useEffect(() => {
		const fetchInitialProducts = async () => {
			let posters: PrintifyProduct[] = [];
			let shirts: PrintifyProduct[] = [];
			try {
				const res = await fetch("/api/printify/tshirts");
				const data = await res.json();
				if (data.error) throw new Error(data.error);
				shirts = data;
				console.log(shirts)
			} catch (error) {
				console.error("Error fetching initial products:", error);
			}
			try {
				const res = await fetch("/api/printify/posters");
				const data = await res.json();
				if (data.error) throw new Error(data.error);
				posters = data;
			} catch (error) {
				console.error("Error fetching initial products:", error);
			}
			const allProducts = [...posters, ...shirts].sort(
				() => Math.random() - 0.5
			);

			setProducts(allProducts);
		};

		fetchInitialProducts();
	}, []);

	return (
		<div className="w-full max-w-full overflow-x-hidden flex flex-col justify-center items-center">
			<TopBar />
			<TickerComponent />
			<div className="flex flex-row w-full max-w-4xl px-4 p-2 md:my-4 my-0 rounded-xl justify-between">
				<Filter />
				<SortBy />
			</div>
			<div className="flex md:flex-row flex-col p-2 md:my-4 my-0 rounded-xl md:justify-around justify-center gap-x-8 gap-y-4 w-full">
				<PopularItem displayName="Prints" imagePath="/LazarDesign.banner.png" />
				<PopularItem displayName="Shirts" imagePath="/LazarDesign.banner.png" />
			</div>
			<div className="grid xl:grid-cols-3 lg:grid-cols-2 grid-cols-1 gap-8 w-full max-w-6xl px-4 items-center justify-center mb-6 mx-auto">
				{products.map((product) => (
					<ShopItem
						key={product.id}
						displayName={product.title.split("|")[0]}
						productId={product.id}
						imagePath={product.images[0] || "/placeholder.jpg"}
					/>
				))}
			</div>
		</div>
	);
}
