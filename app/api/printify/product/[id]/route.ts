import { NextResponse } from "next/server";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const API_KEY = process.env.PRINTIFY_API_KEY;
  const STORE_ID = process.env.PRINTIFY_STORE_ID;

  if (!API_KEY || !STORE_ID) {
    return NextResponse.json(
      { error: "Missing API credentials" },
      { status: 500 }
    );
  }

  // Construct API URL
  const apiUrl = `https://api.printify.com/v1/shops/${STORE_ID}/products/${id}.json`;

  try {
    // Fetch data
    const response = await fetch(apiUrl, {
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      // Try to get error details if available
      let errorDetails = "Unknown error";
      try {
        const errorData = await response.text();
        errorDetails = errorData;
        // Try to parse as JSON if possible
        try {
          const jsonError = JSON.parse(errorData);
          errorDetails = JSON.stringify(jsonError);
        } catch (e) {
          errorDetails = e as string;
        }
      } catch (e) {
        errorDetails = e as string;
        // If can't get text, use status
        errorDetails = response.statusText;
      }

      console.error(`Printify API error: ${response.status} - ${errorDetails}`);
      return NextResponse.json(
        {
          error: `Printify API error: ${response.statusText}`,
          details: errorDetails,
        },
        { status: response.status }
      );
    }

    // Parse response
    const data = await response.json();
    
    // Check data structure - Printify might return directly or under a data property
    const productData = data.data || data;
    
    return NextResponse.json(productData, { status: 200 });
  } catch (error) {
    console.error("Server error:", error);
    return NextResponse.json(
      { error: "Internal server error", details: String(error) },
      { status: 500 }
    );
  }
}