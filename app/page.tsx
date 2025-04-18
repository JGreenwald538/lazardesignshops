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
	images?: { src: string }[];
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
				shirts = data.data;
			} catch (error) {
				console.error("Error fetching initial products:", error);
			}
			try {
				const res = await fetch("/api/printify/posters");
				const data = await res.json();
				if (data.error) throw new Error(data.error);
				posters = data.data;
			} catch (error) {
				console.error("Error fetching initial products:", error);
			}
			const allProducts = [...posters, ...shirts].sort(() => Math.random() - 0.5);

			setProducts(allProducts);
		};

		fetchInitialProducts();
	}, []);



	return (
		<div className="w-screen flex flex-col justify-center items-center mx-auto">
			<TopBar />
			<TickerComponent />
			<div className="flex flex-row border-black w-3/4 p-2 md:my-4 my-0 rounded-xl justify-between">
				<Filter />
				<SortBy />
			</div>
			<div className="flex flex-row p-2 md:my-4 my-0 rounded-xl md:justify-around justify-center gap-x-20">
				<PopularItem displayName="Prints" imagePath="/LazarDesign.banner.png" />
				<PopularItem displayName="Shirts" imagePath="/LazarDesign.banner.png" />
			</div>
			<div className="grid xl:grid-cols-3 lg:grid-cols-2 grid-cols-1 w-fit items-center justify-center mb-6 mx-auto gap-x-40">
				{products.map((product) => (
					<ShopItem
						key={product.id}
						displayName={product.title.split("|")[0]}
						productId={product.id}
						imagePath={product.images?.[0]?.src || "/placeholder.jpg"}
					/>
				))}
			</div>
		</div>
	);
}
