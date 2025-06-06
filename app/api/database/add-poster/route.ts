import { DataRowPoster } from "@/app/utils/DataRowPoster";
import { neon } from "@neondatabase/serverless";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
	const DATABASE_URL = process.env.DATABASE_URL;
	const API_KEY = process.env.PRINTIFY_API_KEY;
	const STORE_ID = process.env.PRINTIFY_STORE_ID;

	if (!DATABASE_URL) {
		return NextResponse.json(
			{ error: "Missing database URL" },
			{ status: 500 }
		);
	}

	const { poster }: { poster: DataRowPoster } = await req.json();

	const sql = neon(DATABASE_URL);

	const apiUrl = `https://api.printify.com/v1/shops/${STORE_ID}/products/${poster.id.trim()}.json`;

	try {
		const printifyResult = await fetch(apiUrl, {
			headers: {
				Authorization: `Bearer ${API_KEY}`,
				"Content-Type": "application/json",
			},
		});

		if (!printifyResult) {
			console.error("Not valid ID: " + poster.id);
			return NextResponse.json(
				{ error: "Failed to add poster" },
				{ status: 500 }
			);
		}

		const posterResult = await sql`SELECT * FROM posters WHERE id = ${poster.id}`;

		const printifyProduct = (await printifyResult.json()) as {
			created_at: string;
			updated_at: string;
			images: { src: string }[];
			description: string;
		};

		if (posterResult.length !== 0) {
			await sql`UPDATE posters 
            SET 
            productname=${poster["Product Name"]}, 
			description=${printifyProduct.description},
            price11by14=${poster['11"x14" Price']},
            price12by16=${poster['12"x16" Price']},
            price16by20=${poster['16"x20" Price']},
            price20by24=${poster['20"x24" Price']},
            price18by24=${poster['18"x24" Price']},
			price24by32=${poster['24"x32" Price']},
			images=${printifyProduct.images.map((image) => image.src)},
			created_at=${printifyProduct.created_at},
			updated_at=${printifyProduct.updated_at}
            WHERE
            id=${poster.id}`;

			return NextResponse.json(
				{ message: "Poster updated successfully" },
				{ status: 200 }
			);
		} else {
			await sql`INSERT INTO posters (id, description, productname, price11by14, price12by16, price16by20, price20by24, price18by24, price24by32, created_at, updated_at, images) 
            VALUES (${poster.id}, 
                ${poster["Product Name"]}, 
				${printifyProduct.description},
                ${poster['11"x14" Price']}, 
                ${poster['12"x16" Price']}, 
                ${poster['16"x20" Price']}, 
                ${poster['20"x24" Price']}, 
                ${poster['18"x24" Price']}, 
                ${poster['24"x32" Price']},
				${printifyProduct.created_at},
				${printifyProduct.updated_at},
				${printifyProduct.images.map((image) => image.src)})`;
			return NextResponse.json(
				{ message: "Poster added successfully" },
				{ status: 200 }
			);
		}
	} catch (error) {
		console.error("Database addition/update failed:", error);
		return NextResponse.json(
			{ error: "Failed to update tshirt" },
			{ status: 500 }
		);
	}
}
