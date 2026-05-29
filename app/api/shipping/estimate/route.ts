import { NextRequest, NextResponse } from "next/server";

const largePosterSizes = new Set(["18x24", "20x24", "24x32"]);
const extendedTshirtSizes = new Set(["2XL", "3XL"]);
const nearbyRegions = new Set([
	"CT",
	"DC",
	"DE",
	"MA",
	"MD",
	"ME",
	"NH",
	"NJ",
	"NY",
	"PA",
	"RI",
	"VA",
	"VT",
	"WV",
]);
const centralRegions = new Set([
	"AL",
	"AR",
	"FL",
	"GA",
	"IA",
	"IL",
	"IN",
	"KY",
	"LA",
	"MI",
	"MN",
	"MO",
	"MS",
	"NC",
	"ND",
	"OH",
	"SC",
	"SD",
	"TN",
	"WI",
]);

function getTransitDayAdjustment(country: string, region: string) {
	if (country && country !== "US") {
		return 0;
	}

	if (nearbyRegions.has(region)) return -1;
	if (centralRegions.has(region)) return 0;
	if (region) return 1;

	return 0;
}

function getProductDayRange(productType: string, size: string) {
	const isPoster = productType === "poster";
	const isLargePoster = isPoster && largePosterSizes.has(size);
	const isExtendedTshirt = productType === "tshirt" && extendedTshirtSizes.has(size);
	const variantAdjustment = isLargePoster || isExtendedTshirt ? 1 : 0;

	if (isPoster) {
		return {
			min: 4 + variantAdjustment,
			max: 7 + variantAdjustment,
		};
	}

	return {
		min: 5 + variantAdjustment,
		max: 8 + variantAdjustment,
	};
}

export async function GET(request: NextRequest) {
	const { searchParams } = request.nextUrl;
	const productType = searchParams.get("productType") || "";
	const size = searchParams.get("size") || "";
	const country =
		request.headers.get("x-vercel-ip-country") ||
		request.headers.get("cf-ipcountry") ||
		"US";
	const region = request.headers.get("x-vercel-ip-country-region") || "";
	const city = request.headers.get("x-vercel-ip-city") || "";

	if (country !== "US") {
		return NextResponse.json({
			estimate: "US shipping only; final timing at checkout",
			location: country,
			isLocationBased: true,
		});
	}

	const productRange = getProductDayRange(productType, size);
	const transitAdjustment = getTransitDayAdjustment(country, region);
	const minDays = Math.max(3, productRange.min + transitAdjustment);
	const maxDays = Math.max(minDays + 1, productRange.max + transitAdjustment);
	const location = [city, region].filter(Boolean).join(", ") || "your area";

	return NextResponse.json({
		estimate: `${minDays}-${maxDays} business days`,
		location,
		isLocationBased: Boolean(region || city),
	});
}
