import { neon } from "@neondatabase/serverless";
import { NextResponse } from "next/server";

export async function GET(
) {
	try {
		const DATABASE_URL = process.env.DATABASE_URL;

		if (!DATABASE_URL) {
			return NextResponse.json(
				{ error: "Missing database URL" },
				{ status: 500 }
			);
		}

		const sql = neon(DATABASE_URL);

		const posterResult = await sql`SELECT * FROM posters`;

		if (!posterResult || posterResult.length === 0) {
			return NextResponse.json(
				{ error: "No t-shirt products found" },
				{ status: 404 }
			);
		}

		const posterResults = []

		for (const poster of posterResult) {
			// It's a t-shirt product
			const posterData = poster;
			const productData = {
				id: posterData.id,
				title: posterData.productname,
				description: posterData.description || "",
				images: posterData.images,
				product_type: "poster",
				prices:
				[{size: "11x14", price: posterData.price11by14},
				{size: "12x16", price: posterData.price12by16},
				{size: "16x20", price: posterData.price16by20},
				{size: "20x24", price: posterData.price20by24},
				{size: "18x24", price: posterData.price18by24},
				{size: "24x32", price: posterData.price24by32}],
			};

			posterResults.push(productData);
		}

		return NextResponse.json(posterResults, { status: 200 });

	} catch (error) {
		console.error("Error fetching product:", error);
		return NextResponse.json(
			{ error: (error as Error).message },
			{ status: 500 }
		);
	}
}
