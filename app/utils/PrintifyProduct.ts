export type PrintifyProduct = {
	id: string;
	title: string;
	description: string;
	images: string[];
	created_at: string;
	updated_at: string;
	product_type: string;
	prices: {
		size: string;
		price: number | null;
	}[];
	colors?: string[];
};

export function isValidPrintifyProduct(
	data: PrintifyProduct
): data is PrintifyProduct {
	// Check required fields
	const hasRequiredFields =
		typeof data === "object" &&
		data !== null &&
		typeof data.id === "string" &&
		typeof data.title === "string" &&
		typeof data.description === "string" &&
		Array.isArray(data.images) &&
		data.images.every((img: string) => typeof img === "string") &&
		typeof data.created_at === "string" &&
		typeof data.updated_at === "string" &&
		typeof data.product_type === "string" &&
		Array.isArray(data.prices) &&
		data.prices.every(
			(price: { size: string; price: number | null }) =>
				typeof price === "object" &&
				price !== null &&
				typeof price.size === "string" &&
				typeof price.price === "number" || price.price === null
		);

	// Check optional fields
	const hasValidColors =
		!data.colors ||
		(Array.isArray(data.colors) &&
			data.colors.every((color: string) => typeof color === "string"));

	// Ensure no extra fields
	const allowedKeys = [
		"id",
		"title",
		"description",
		"images",
		"colors",
		"created_at",
		"updated_at",
		"product_type",
		"prices",
	];
	const hasNoExtraFields = Object.keys(data).every((key) =>
		allowedKeys.includes(key)
	);

	return hasRequiredFields && hasValidColors && hasNoExtraFields;
}
