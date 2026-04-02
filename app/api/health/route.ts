import { NextResponse } from "next/server";

export async function GET() {
	const API_KEY = process.env.PRINTIFY_API_KEY;
	const STORE_ID = process.env.PRINTIFY_STORE_ID;

	const isKeyPlaceholder = API_KEY?.includes("ADD_YOUR") || !API_KEY || API_KEY === "";
	const isStoreIdValid = STORE_ID === "12127895";

	if (isKeyPlaceholder) {
		return NextResponse.json(
			{
				status: "SETUP_NEEDED",
				message: "PRINTIFY_API_KEY is not configured",
				apiKeyStatus: {
					present: !!API_KEY,
					isPlaceholder: API_KEY?.includes("ADD_YOUR") || false,
					isEmpty: !API_KEY || API_KEY === "",
				},
				nextSteps: [
					"1. Go to https://printify.com/app/account/api",
					"2. Generate a personal access token (JWT format, starts with 'eyJ')",
					"3. Update .env file: PRINTIFY_API_KEY=\"your_long_token_string_here\"",
					"4. Save the file",
					"5. Restart dev server: killall bun && bun dev",
					"6. Then test: curl http://localhost:3000/api/health",
				],
			},
			{ status: 400 }
		);
	}

	// Key is set, test it
	try {
		const response = await fetch("https://api.printify.com/v1/shops.json", {
			headers: {
				Authorization: `Bearer ${API_KEY}`,
				"User-Agent": "lazardesignshops-server",
			},
		});

		if (response.ok) {
			const shops = await response.json();
			return NextResponse.json({
				status: "READY",
				message: "✅ Printify API key is valid and working!",
				shops: shops.length,
				readyForAddToCart: true,
			});
		} else {
			const errorBody = await response.text();
			return NextResponse.json(
				{
					status: "AUTH_FAILED",
					message: `❌ Printify API returned HTTP ${response.status}`,
					error: errorBody,
					apiKeyLength: API_KEY?.length,
					nextSteps: [
						"The API key in .env is not working with Printify",
						"Reasons: expired, wrong app, wrong account, incomplete copy",
						"Fix: Regenerate from https://printify.com/app/account/api",
						"Make sure you copy the ENTIRE token (it's very long)",
						"Then: killall bun && bun dev",
					],
				},
				{ status: response.status }
			);
		}
	} catch (error) {
		return NextResponse.json(
			{
				status: "ERROR",
				message: "Failed to test API key: " + String(error),
			},
			{ status: 500 }
		);
	}
}
