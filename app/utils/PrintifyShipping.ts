import "server-only";

type CartItem = {
	variantID: number;
	price: number;
	quantity: number;
	name: string;
	id: string;
	images: string[];
};

export type ShippingAddress = {
	firstName: string;
	lastName: string;
	email: string;
	phone?: string;
	address1: string;
	address2?: string;
	city: string;
	region: string;
	zip: string;
	country: string;
};

type PrintifyShippingResponse = {
	standard?: number;
	express?: number;
	priority?: number;
	printify_express?: number;
	economy?: number;
};

export type PrintifyShippingOptionId = keyof PrintifyShippingResponse;

export type PrintifyShippingOption = {
	id: PrintifyShippingOptionId;
	label: string;
	amount: number;
	printifyMethod: 1 | 2 | 3 | 4;
};

const shippingOptionConfig: Record<
	PrintifyShippingOptionId,
	{ label: string; printifyMethod: 1 | 2 | 3 | 4; sortOrder: number }
> = {
	standard: {
		label: "Standard",
		printifyMethod: 1,
		sortOrder: 1,
	},
	economy: {
		label: "Economy",
		printifyMethod: 4,
		sortOrder: 2,
	},
	priority: {
		label: "Priority",
		printifyMethod: 2,
		sortOrder: 3,
	},
	express: {
		label: "Priority",
		printifyMethod: 2,
		sortOrder: 4,
	},
	printify_express: {
		label: "Express",
		printifyMethod: 3,
		sortOrder: 5,
	},
};

export function normalizeShippingAddress(
	address: ShippingAddress,
): ShippingAddress {
	return {
		firstName: address.firstName.trim(),
		lastName: address.lastName.trim(),
		email: address.email.trim(),
		phone: address.phone?.trim() || "",
		address1: address.address1.trim(),
		address2: address.address2?.trim() || "",
		city: address.city.trim(),
		region: address.region.trim().toUpperCase(),
		zip: address.zip.trim(),
		country: address.country.trim().toUpperCase(),
	};
}

export function validateShippingAddress(address: ShippingAddress) {
	const requiredFields: (keyof ShippingAddress)[] = [
		"firstName",
		"lastName",
		"email",
		"address1",
		"city",
		"region",
		"zip",
		"country",
	];

	for (const field of requiredFields) {
		if (!address[field]?.trim()) {
			throw new Error("Please complete the shipping address.");
		}
	}

	if (address.country !== "US") {
		throw new Error("Shipping is currently only available in the United States.");
	}
}

function createShippingOptions(
	data: PrintifyShippingResponse,
	standardDiscount = 0,
): PrintifyShippingOption[] {
	const options = Object.entries(data)
		.filter(
			(entry): entry is [PrintifyShippingOptionId, number] =>
				entry[0] in shippingOptionConfig && typeof entry[1] === "number",
		)
		.map(([id, amount]) => {
			const config = shippingOptionConfig[id];
			return {
				id,
				label: config.label,
				amount:
					id === "standard" ? Math.max(0, amount - standardDiscount) : amount,
				printifyMethod: config.printifyMethod,
			};
		})
		.sort(
			(optionA, optionB) =>
				shippingOptionConfig[optionA.id].sortOrder -
				shippingOptionConfig[optionB.id].sortOrder,
		);

	const seenLabels = new Set<string>();
	return options.filter((option) => {
		const signature = `${option.label}-${option.amount}`;
		if (seenLabels.has(signature)) return false;
		seenLabels.add(signature);
		return true;
	});
}

export function getPrintifyShippingMethod(optionId: PrintifyShippingOptionId) {
	return shippingOptionConfig[optionId]?.printifyMethod || 1;
}

export async function calculatePrintifyShippingOptions(
	cart: CartItem[],
	address: ShippingAddress,
	standardDiscount = 0,
) {
	const API_KEY = process.env.PRINTIFY_API_KEY?.trim();
	const STORE_ID = process.env.PRINTIFY_STORE_ID?.trim();

	if (!API_KEY || !STORE_ID) {
		throw new Error("Missing Printify configuration.");
	}

	const normalizedAddress = normalizeShippingAddress(address);
	validateShippingAddress(normalizedAddress);

	const lineItems = cart.map((item) => ({
		product_id: item.id.trim(),
		variant_id: item.variantID,
		quantity: item.quantity,
	}));

	const response = await fetch(
		`https://api.printify.com/v1/shops/${STORE_ID}/orders/shipping.json`,
		{
			method: "POST",
			headers: {
				Authorization: `Bearer ${API_KEY}`,
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				line_items: lineItems,
				address_to: {
					first_name: normalizedAddress.firstName,
					last_name: normalizedAddress.lastName,
					email: normalizedAddress.email,
					phone: normalizedAddress.phone || "",
					country: normalizedAddress.country,
					region: normalizedAddress.region,
					address1: normalizedAddress.address1,
					address2: normalizedAddress.address2 || "",
					city: normalizedAddress.city,
					zip: normalizedAddress.zip,
				},
			}),
		},
	);

	const responseText = await response.text();
	let data: PrintifyShippingResponse | { error?: string; message?: string } = {};

	if (responseText) {
		try {
			data = JSON.parse(responseText);
		} catch {
			data = { message: responseText };
		}
	}

	if (!response.ok) {
		console.error("Printify shipping quote failed:", response.status, data);
		throw new Error("Could not calculate shipping for that address.");
	}

	const options = createShippingOptions(
		data as PrintifyShippingResponse,
		standardDiscount,
	);

	if (options.length === 0) {
		console.error("Printify shipping options unavailable:", data);
		throw new Error("Shipping is unavailable for that cart and address.");
	}

	return options;
}

export async function calculatePrintifyShippingAmount(
	cart: CartItem[],
	address: ShippingAddress,
	optionId: PrintifyShippingOptionId,
	standardDiscount = 0,
) {
	const options = await calculatePrintifyShippingOptions(
		cart,
		address,
		standardDiscount,
	);
	const option = options.find((shippingOption) => shippingOption.id === optionId);

	if (!option) {
		throw new Error("That shipping option is unavailable for this order.");
	}

	return option.amount;
}
