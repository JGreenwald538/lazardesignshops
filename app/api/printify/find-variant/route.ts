import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
	const API_KEY = process.env.PRINTIFY_API_KEY;
	const STORE_ID = process.env.PRINTIFY_STORE_ID;

	if (!API_KEY || !STORE_ID) {
		return NextResponse.json(
			{ error: "Missing Printify configuration" },
			{ status: 500 }
		);
	}

	const {
		id,
		size,
		color,
	}: { id?: string; size?: string; color?: string } = await req.json();

	if (!id || !size) {
		return NextResponse.json(
			{ error: "Missing product id or size" },
			{ status: 400 }
		);
	}

	const convertSize = {
		Small: "S",
		Medium: "M",
		Large: "L",
		XL: "XL",
		"2XL": "2XL",
		"3XL": "3XL",
		"4XL": "4XL",
		"5XL": "5XL",
	};

	function convertPosterSizeFancy(size: string) {
		const sizeList = size.split("x");
		const horizontalSize = sizeList[0];
		const verticalSize = sizeList[1];
		return horizontalSize + "″ x " + verticalSize + "″";
	}

	function convertPosterSizeRegular(size: string) {
		const sizeList = size.split("x");
		const horizontalSize = sizeList[0];
		const verticalSize = sizeList[1];
		return horizontalSize + '" x ' + verticalSize + '"';
	}

	const apiUrl = `https://api.printify.com/v1/shops/${STORE_ID}/products/${id}.json`;

	if (color) {
		// t-shirt
		try {
			const printifyResult = await fetch(apiUrl, {
				headers: {
					Authorization: `Bearer ${API_KEY}`,
					"User-Agent": "lazardesignshops-server",
					"Content-Type": "application/json",
				},
			});

			if (!printifyResult.ok) {
				const errorText = await printifyResult.text();
				console.error("Printify request failed:", printifyResult.status, errorText);
				const errorMessage =
					printifyResult.status === 401
						? "Printify authentication failed (check PRINTIFY_API_KEY and PRINTIFY_STORE_ID)"
						: "Failed to find Printify variant";
				return NextResponse.json(
					{ error: errorMessage },
					{ status: printifyResult.status }
				);
			}

			const printifyProduct = (await printifyResult.json()) as {
				variants: { title: string; is_enabled: boolean; id: number }[];
			};

			const variant = printifyProduct.variants.find(
				(variant) =>
					variant.title ===
					convertSize[size as keyof typeof convertSize] + " / " + color ||
					variant.title ===
					color + " / " + convertSize[size as keyof typeof convertSize]
			);

			const variantId = variant?.id;

			if (!variantId) {
				return NextResponse.json(
					{ error: "No matching Printify variant found" },
					{ status: 404 }
				);
			}

			return NextResponse.json({ variantId }, { status: 200 });
		} catch (e) {
			console.error(e);
			return NextResponse.json(
				{ error: "Failed to find Printify variant" },
				{ status: 500 }
			);
		}
	} else {
		// poster
		try {
			const printifyResult = await fetch(apiUrl, {
				headers: {
					Authorization: `Bearer ${API_KEY}`,
					"User-Agent": "lazardesignshops-server",
					"Content-Type": "application/json",
				},
			});

			if (!printifyResult.ok) {
				const errorText = await printifyResult.text();
				console.error("Printify request failed:", printifyResult.status, errorText);
				const errorMessage =
					printifyResult.status === 401
						? "Printify authentication failed (check PRINTIFY_API_KEY and PRINTIFY_STORE_ID)"
						: "Failed to find Printify variant";
				return NextResponse.json(
					{ error: errorMessage },
					{ status: printifyResult.status }
				);
			}

			const printifyProduct = (await printifyResult.json()) as {
				variants: { title: string; is_enabled: boolean; id: number }[];
			};

			const variant = printifyProduct.variants.find((variant) => {
				console.log(variant.title, convertPosterSizeFancy(size));
				return (
					variant.title.includes(convertPosterSizeFancy(size)) ||
					variant.title.includes(convertPosterSizeRegular(size))
				);
			});

			const variantId = variant?.id;

			if (!variantId) {
				return NextResponse.json(
					{ error: "No matching Printify variant found" },
					{ status: 404 }
				);
			}

			return NextResponse.json({ variantId }, { status: 200 });
		} catch (e) {
			console.error(e);
			return NextResponse.json(
				{ error: "Failed to find Printify variant" },
				{ status: 500 }
			);
		}
	}
}
