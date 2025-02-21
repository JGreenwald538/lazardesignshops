"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";

interface PrintifyProduct {
	id: string;
	title: string;
	description?: string;
	images?: { src: string }[];
}

export default function ProductPage() {
	const { id } = useParams();
	const [product, setProduct] = useState<PrintifyProduct | null>(null);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);

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

	return (
		<div>
			{loading && <p>Loading product...</p>}
			{error && <p style={{ color: "red" }}>{error}</p>}
			{product && (
				<div
					className="flex justify-center flex-col items-center h-screen"
					key={"asd"}
				>
					<div className="text-4xl font-bold">{product.title}</div>
					{product.description
						?.split(".:")
						.map((text: string, index: number) => (
							<div key={index.toString()} className="w-1/2 text-center">{text}</div>
						)) || "No description available"}
					{product.images && product.images.length > 0 && (
						<Image
							src={product.images[0].src}
							alt={product.title}
							width={300}
							height={4000}
						/>
					)}
				</div>
			)}
		</div>
	);
}
