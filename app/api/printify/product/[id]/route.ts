import { neon } from "@neondatabase/serverless";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
) {
	try {
		const { id } = await params; // Await the resolution of params to access 'id'
		const DATABASE_URL = process.env.DATABASE_URL;

		if (!DATABASE_URL) {
			return NextResponse.json(
				{ error: "Missing database URL" },
				{ status: 500 }
			);
		}

		const sql = neon(DATABASE_URL);

		// Check if product exists in tshirts table
		const tshirtResult = await sql`SELECT * FROM tshirts WHERE id = ${id}`;

		if (tshirtResult && tshirtResult.length > 0) {
			// It's a t-shirt product
			const tshirtData = tshirtResult[0];
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
				updated_at: tshirtData.updated_at,
			};

			return NextResponse.json(productData, { status: 200 });
		}

		// If not in tshirts, check if product exists in posters table
		const posterResult = await sql`SELECT * FROM posters WHERE id = ${id}`;

		if (posterResult && posterResult.length > 0) {
			// It's a poster product
			const posterData = posterResult[0];
			const productData = {
				id: posterData.id,
				title: posterData.productname,
				description: posterData.description || "",
				images: posterData.images,
				product_type: "poster",
				prices: [
					{ size: "11x14", price: posterData.price11by14 },
					{ size: "12x16", price: posterData.price12by16 },
					{ size: "16x20", price: posterData.price16by20 },
					{ size: "20x24", price: posterData.price20by24 },
					{ size: "18x24", price: posterData.price18by24 },
					{ size: "24x32", price: posterData.price24by32 },
				],
				created_at: posterData.created_at,
				updated_at: posterData.updated_at,
			};

			return NextResponse.json(productData, { status: 200 });
		}

		// If product not found in either table
		return NextResponse.json({ error: "Product not found" }, { status: 404 });
	} catch (error) {
		console.error("Error fetching product:", error);
		return NextResponse.json(
			{ error: (error as Error).message },
			{ status: 500 }
		);
	}
}
