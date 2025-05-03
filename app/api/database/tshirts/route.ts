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

		const tshirtResult = await sql`SELECT * FROM tshirts`;

		if (!tshirtResult || tshirtResult.length === 0) {
			return NextResponse.json(
				{ error: "No t-shirt products found" },
				{ status: 404 }
			);
		}

		const tshirtResults = []

		for (const tshirt of tshirtResult) {
			// It's a t-shirt product
			const tshirtData = tshirt;
			const productData = {
				id: tshirtData.id,
				title: tshirtData.productname,
				description: tshirtData.description || "",
				images: tshirtData.images,
				prices: [
					{ size: "Small", price: tshirtData.smallprice },
					{ size: "Medium", price: tshirtData.mediumprice },
					{ size: "Large", price: tshirtData.largeprice },
					{ size: "XL", price: tshirtData.xlprice },
					{ size: "2XL", price: tshirtData.doublexlprice },
					{ size: "3XL", price: tshirtData.triplexlprice },
				],
				product_type: "tshirt",
				colors: tshirtData.colors,
				created_at: tshirtData.created_at,
				updated_at: tshirtData.updated_at
			};
			

			tshirtResults.push(productData);
		}

		return NextResponse.json(tshirtResults, { status: 200 });

	} catch (error) {
		console.error("Error fetching product:", error);
		return NextResponse.json(
			{ error: (error as Error).message },
			{ status: 500 }
		);
	}
}
