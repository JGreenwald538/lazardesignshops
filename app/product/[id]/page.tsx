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

    console.log(product)

	return (
		<div>
			{loading && <p>Loading product...</p>}
			{error && <p style={{ color: "red" }}>{error}</p>}
			{product && (
				<div
					className="flex justify-center md:flex-row flex-col items-center h-screen"
					key={"asd"}
				>
					{product.images && product.images.length > 0 && (
						<Image
							src={product.images[0].src}
							alt={product.title}
							width={4000}
							height={4000}
                            className="object-scale-down w-96"
						/>
					)}
					<div className="flex flex-col justify-center items-center md:w-1/2 w-full px-4 md:px-0">
						<div className="text-4xl font-bold text-left w-full">{product.title}</div>
						{product.description
							?.split(".:")
							.map((text: string, index: number) => (
								<div key={index.toString()} className="text-start w-full mt-2">
									{text}
								</div>
							)) || "No description available"}
					</div>
				</div>
			)}
		</div>
	);
}
