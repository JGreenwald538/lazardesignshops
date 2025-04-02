"use client";

import { useEffect, useState, useRef } from "react";
import ShopItem from "./components/ShopItem";
import TopBar from "./components/TopBar";
import Filter from "./components/Filter";
import SortBy from "./components/SortBy";
import TickerComponent from "./components/Ticker";
import PopularItem from "./components/PopularItem";
import { useSearchParams } from "next/navigation";
// import { neon } from "@neondatabase/serverless";

interface PrintifyProduct {
	id: string;
	title: string;
	images?: { src: string }[];
}

export default function Home() {
	const [products, setProducts] = useState<PrintifyProduct[]>([]);
	const [loading, setLoading] = useState(false);
	const [nextCursor, setNextCursor] = useState<string | null>(null);
	const observer = useRef<IntersectionObserver | null>(null);
	const searchParams = useSearchParams();
	console.log(searchParams.get("f"));

	// Fetch initial batch of 10 products
	useEffect(() => {
		const fetchInitialProducts = async () => {
			try {
				const res = await fetch("/api/printify/products?limit=10");
				const data = await res.json();
				if (data.error) throw new Error(data.error);

				setProducts(data.data);
				setNextCursor(data.nextCursor); // Save cursor for pagination
			} catch (error) {
				console.error("Error fetching initial products:", error);
			}
			// const sql = neon(`${process.env.DATABASE_URL}`);
			// const res = await sql`SELECT * FROM tshirts LIMIT 10`;
			// const data = res.rows;
			// if (data.error) throw new Error(data.error);
			// const formattedProducts = data.map((product: any) => ({
			// 	id: product.id,
			// 	title: product.productname,
			// 	images: [
			// 		{ src: product.imagepath || "/placeholder.jpg" },
			// 	],
			// }));
			// setProducts(formattedProducts);
		};

		fetchInitialProducts();
	}, []);

	// Fetch additional products in batches of 50
	const fetchMoreProducts = async () => {
		if (loading || !nextCursor) return;
		setLoading(true);

		try {
			const res = await fetch(
				`/api/printify/products?limit=50&after=${nextCursor}`
			);
			const data = await res.json();
			if (data.error) throw new Error(data.error);

			setProducts((prev) => [...prev, ...data.data]);
			setNextCursor(data.nextCursor); // Update cursor for next batch
		} catch (error) {
			console.error("Error fetching more products:", error);
		} finally {
			setLoading(false);
		}
	};

	// Set up Intersection Observer to trigger load more
	useEffect(() => {
		if (observer.current) observer.current.disconnect();

		observer.current = new IntersectionObserver(
			(entries) => {
				if (entries[0].isIntersecting) {
					fetchMoreProducts();
				}
			},
			{ threshold: 1 }
		);

		const target = document.getElementById("load-more-trigger");
		if (target) observer.current.observe(target);

		return () => observer.current?.disconnect();
	}, [nextCursor, fetchMoreProducts]);

	return (
		<div className="w-screen flex flex-col justify-center items-center mx-auto">
			<TopBar />
			<TickerComponent />
			<div className="flex flex-row border-black w-3/4 p-2 my-4 rounded-xl justify-between">
				<Filter />
				<SortBy />
			</div>
			<div className="flex flex-row w-3/4 p-2 my-4 rounded-xl md:justify-around justify-center gap-x-4">
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
			<div id="load-more-trigger" className="h-10 w-full"></div>
			{loading && <p className="mt-4">Loading more products...</p>}
			{!nextCursor && (
				<p className="mt-4 text-gray-500">No more products to load.</p>
			)}
		</div>
	);
}
