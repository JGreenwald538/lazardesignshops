import { NextResponse } from "next/server";

export async function GET() {
	try {
		const API_KEY = process.env.PRINTIFY_API_KEY;
		const STORE_ID = process.env.PRINTIFY_STORE_ID;

		if (!API_KEY || !STORE_ID) {
			return NextResponse.json(
				{ error: "Missing API credentials" },
				{ status: 500 }
			);
		}

		// Construct API URL
		const apiUrl = `https://api.printify.com/v1/shops/${STORE_ID}/products.json`;

		// Fetch data
		const response = await fetch(apiUrl, {
			headers: {
				Authorization: `Bearer ${API_KEY}`,
				"Content-Type": "application/json",
			},
		});

		if (!response.ok) {
			const errorData = await response.json();
			return NextResponse.json(
				{
					error: `Printify API error: ${response.statusText}`,
					details: errorData,
				},
				{ status: response.status }
			);
		}

		const data = await response.json();

		// Determine next cursor for pagination
		const nextCursor =
			data.data.length > 0 ? data.data[data.data.length - 1].id : null;

		return NextResponse.json(
			{
				data: data.data,
				nextCursor, // Cursor-based pagination
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
