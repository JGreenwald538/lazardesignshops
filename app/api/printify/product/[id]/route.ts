import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  context: { params: { id: string } } // Use `context` to reference params
) {
  try {
    const API_KEY = process.env.PRINTIFY_API_KEY;
    const STORE_ID = process.env.PRINTIFY_STORE_ID;
    
    if (!API_KEY || !STORE_ID) {
      return NextResponse.json({ error: "Missing API credentials" }, { status: 500 });
    }

    // Ensure params is properly awaited before using
    const { id } = await context.params; 

    if (!id) {
      return NextResponse.json({ error: "Product ID is required" }, { status: 400 });
    }

    // Fetch a specific product by ID
    const response = await fetch(
      `https://api.printify.com/v1/shops/${STORE_ID}/products/${id}.json`,
      {
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        { error: `Printify API error: ${response.statusText}`, details: errorData },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("Error fetching Printify product:", error);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
