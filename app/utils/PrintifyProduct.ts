export type PrintifyProduct = {
	id: string;
	title: string;
	description: string;
	images: string[];
	colors: string[];
	created_at: string;
	updated_at: string;
	product_type: string;
	prices?: {
		size: string;
		price: string;
	}[];
	// variants?: {
	// 	id: string;
	// 	title: string;
	// 	price: string;
	// 	sku: string;
	// 	available: boolean;
	// 	options?: { title: string; value: string }[];
	// }[];
	// tags?: string[];
	// available?: boolean;
	// preview_url?: string;
	// shop_id?: string;
	// print_provider_id?: string;
	// blueprint?: {
	// 	id: string;
	// 	title: string;
	// 	preview_url: string;
	// 	created_at: string;
	// 	updated_at: string;
	// 	available: boolean;
	// 	images?: { src: string }[];
	// };
	// blueprint_id?: string;
	// created_by?: string;
	// updated_by?: string;
	// 
}

export function isValidPrintifyProduct(data: PrintifyProduct): data is PrintifyProduct {
    // Check required fields
    const hasRequiredFields =
        typeof data === "object" &&
        data !== null &&
        typeof data.id === "string" &&
        typeof data.title === "string" &&
        typeof data.description === "string" &&
        Array.isArray(data.images) &&
        data.images.every((img: string) => typeof img === "string") &&
        Array.isArray(data.colors) &&
        data.colors.every((color: string) => typeof color === "string") &&
        typeof data.created_at === "string" &&
        typeof data.updated_at === "string" &&
        typeof data.product_type === "string";

    // Check optional fields
    const hasValidPrices =
        !data.prices ||
        (Array.isArray(data.prices) &&
            data.prices.every(
                (price: {size: string, price: string}) =>
                    typeof price === "object" &&
                    price !== null &&
                    typeof price.size === "string" &&
                    typeof price.price === "string"
            ));

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

    return hasRequiredFields && hasValidPrices && hasNoExtraFields;
}