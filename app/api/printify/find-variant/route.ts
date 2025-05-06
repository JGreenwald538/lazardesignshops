import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
	const API_KEY = process.env.PRINTIFY_API_KEY;
	const STORE_ID = process.env.PRINTIFY_STORE_ID;

	const {
		id,
		size,
		color,
	}: { id: string; size: string; color: string } = await req.json();

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
					"Content-Type": "application/json",
				},
			});

			if (!printifyResult) {
				console.error("Not valid ID: " + id);
				return NextResponse.json(
					{ error: "Failed to add poster" },
					{ status: 500 }
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

			return NextResponse.json({ variantId: variantId }, { status: 200 });
		} catch (e) {
			console.error(e);
		}
	} else {
		// poster
		try {
			const printifyResult = await fetch(apiUrl, {
				headers: {
					Authorization: `Bearer ${API_KEY}`,
					"Content-Type": "application/json",
				},
			});

			if (!printifyResult) {
				console.error("Not valid ID: " + id);
				return NextResponse.json(
					{ error: "Failed to add poster" },
					{ status: 500 }
				);
			}

			const printifyProduct = (await printifyResult.json()) as {
				variants: { title: string; is_enabled: boolean; id: number }[];
			};

			const variant = printifyProduct.variants.find((variant) => {
                console.log(variant.title, convertPosterSizeFancy(size))
				return (
					variant.title.includes(convertPosterSizeFancy(size)) ||
					variant.title.includes(convertPosterSizeRegular(size))
				);
			});

			const variantId = variant?.id;

			return NextResponse.json({ variantId: variantId }, { status: 200 });
		} catch (e) {
			console.error(e);
		}
	}
}
