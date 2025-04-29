import { DataRowPoster } from "@/app/utils/DataRowPoster";
import { neon } from "@neondatabase/serverless";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
	const DATABASE_URL = process.env.DATABASE_URL;

	if (!DATABASE_URL) {
		return NextResponse.json(
			{ error: "Missing database URL" },
			{ status: 500 }
		);
	}

	const { poster }: { poster: DataRowPoster } = await req.json();

	const sql = neon(DATABASE_URL);

	try {
		const posterResult = await sql`SELECT * FROM posters WHERE id = ${poster.ID}`;

		if (posterResult) {
			await sql`UPDATE posters 
            SET 
            productname=${poster["Product Name"]}, 
            price11by14=${poster['11"x14" Price']},
            price12by16=${poster['12"x16" Price']},
            price16by20=${poster['16"x20" Price']},
            price20by24=${poster['20"x24" Price']},
            price18by24=${poster['18"x24" Price']},
			price24by32=${poster['24"x32" Price']}
            WHERE
            id=${poster.ID}`;

			return NextResponse.json(
				{ message: "Poster updated successfully" },
				{ status: 200 }
			);
		} else {
			await sql`INSERT INTO posters (id, productname, price11by14, price12by16, price16by20, price20by24, price18by24, price24by32) 
            VALUES (${poster.ID}, 
                ${poster["Product Name"]}, 
                ${poster['11"x14" Price']}, 
                ${poster['12"x16" Price']}, 
                ${poster['16"x20" Price']}, 
                ${poster['20"x24" Price']}, 
                ${poster['18"x24" Price']}, 
                ${poster['24"x32" Price']})`;
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
