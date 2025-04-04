import { neon } from "@neondatabase/serverless";
import { NextResponse } from "next/server";

export async function GET() {
	try {
		const API_KEY = process.env.PRINTIFY_API_KEY;
		const STORE_ID = process.env.PRINTIFY_STORE_ID;

		const sql = neon(`${process.env.DATABASE_URL}`);

		if (!API_KEY || !STORE_ID) {
			return NextResponse.json(
				{ error: "Missing API credentials" },
				{ status: 500 }
			);
		}

		const newApiUrl = `https://api.printify.com/v1/shops/${STORE_ID}/products/`;
		const sqlQuery = await sql`SELECT * FROM posters`;

		const posters = await Promise.all(
            sqlQuery.map(async (row) => {
                const response = await fetch(newApiUrl + row.id.trim() + ".json", {
                    headers: {
                        Authorization: `Bearer ${API_KEY}`,
                        "Content-Type": "application/json",
                    },
                });
                if (!response.ok) {
                    throw new Error(
                        `Printify API error for ID ${row.id}: ${response.statusText}`
                    );
                }
                return response.json()
            })
        );

		for (let i = 0; i < posters.length; i++) {
			posters[i].title = sqlQuery[i].productname;
		}

		return NextResponse.json(
			{
				data: posters,
			},
			{ status: 200 }
		);
	} catch (error) {
		console.error("Error fetching Printify products:", error);
		return NextResponse.json(
			{ error: (error as Error).message },
			{ status: 500 }
		);
	}
}
