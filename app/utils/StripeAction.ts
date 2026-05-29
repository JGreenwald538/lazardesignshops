"use server";

import { headers } from "next/headers";
import type Stripe from "stripe";
import { stripe } from "./Stripe";
import { GetCart, GetCartTotal } from "./Cart";
import {
	calculatePrintifyShippingAmount,
	calculatePrintifyShippingOptions,
	getPrintifyShippingMethod,
	normalizeShippingAddress,
	type PrintifyShippingOptionId,
	type ShippingAddress,
} from "./PrintifyShipping";

export async function fetchShippingOptions(shippingAddress: ShippingAddress) {
	const cart = await GetCart();

	if (!cart || !Array.isArray(cart) || cart.length === 0) {
		throw new Error("Cart is empty or invalid");
	}

	const cartTotal = await GetCartTotal();
	const rawOptions = await calculatePrintifyShippingOptions(cart, shippingAddress);
	const standardDiscount =
		cartTotal >= 35
			? rawOptions.find((option) => option.id === "standard")?.amount || 0
			: 0;

	return rawOptions.map((option) => ({
		...option,
		amount:
			option.id === "standard"
				? Math.max(0, option.amount - standardDiscount)
				: option.amount,
	}));
}

export async function fetchClientSecret(
	shippingAddress: ShippingAddress,
	shippingOptionId: PrintifyShippingOptionId,
) {
	try {
		const origin = (await headers()).get("origin");
		const cart = await GetCart();
		const normalizedShippingAddress = normalizeShippingAddress(shippingAddress);

		// Validate cart data
		if (!cart || !Array.isArray(cart) || cart.length === 0) {
			throw new Error("Cart is empty or invalid");
		}

		const cartTotal = await GetCartTotal();
		const rawOptions = await calculatePrintifyShippingOptions(
			cart,
			normalizedShippingAddress,
		);
		const standardDiscount =
			cartTotal >= 35
				? rawOptions.find((option) => option.id === "standard")?.amount || 0
				: 0;
		const printifyShippingAmount = await calculatePrintifyShippingAmount(
			cart,
			normalizedShippingAddress,
			shippingOptionId,
			standardDiscount,
		);
		const selectedShippingMethod =
			getPrintifyShippingMethod(shippingOptionId).toString();

		// Create an array of line items after validating each cart item
		const lineItems = [];

		for (const item of cart) {
			// Validate each item has required properties
			if (!item || typeof item !== "object") {
				console.error("Invalid cart item:", item);
				continue; // Skip invalid items instead of failing
			}

			if (!item.name) {
				console.error("Cart item missing name:", item);
				continue; // Skip items without names
			}

			if (!item.variantID) {
				console.error("Cart item missing variantID:", item);
				continue;
			}

			if (!item.price || isNaN(item.price)) {
				console.error("Cart item has invalid price:", item);
				continue;
			}

			try {
				// Create a price for the product
				const price = await stripe.prices.create({
					product_data: {
						name: item.name,
					},
					unit_amount: Math.round(item.price * 100), // Convert to cents
					currency: "USD",
				});

				await stripe.products.update(
					typeof price.product === "string" ? price.product : "",
					{
						images: [item.images[0]],
					}
				);

				// Add to line items
				lineItems.push({
					price: price.id,
					quantity: item.quantity || 1,
				});
			} catch (error) {
				console.error(`Error creating price for item ${item.name}:`, error);
				// Continue with other items instead of failing completely
			}
		}

		if (lineItems.length === 0) {
			throw new Error("No valid items could be processed");
		}

		if (printifyShippingAmount > 0) {
			const shippingPrice = await stripe.prices.create({
				product_data: {
					name: "Shipping Fee",
				},
				unit_amount: printifyShippingAmount,
				currency: "USD",
			})
			lineItems.push({
				price: shippingPrice.id,
				quantity: 1,
			});
		}

		// Create Checkout Session
		const sessionParams: Stripe.Checkout.SessionCreateParams = {
			ui_mode: "embedded_page",
			line_items: lineItems,
			mode: "payment",
			return_url: `${origin}/return?session_id={CHECKOUT_SESSION_ID}`,
			billing_address_collection: "required", // Collect full billing address
			customer_email: normalizedShippingAddress.email,
			phone_number_collection: {
				enabled: true,
			},
			metadata: {
				shipping_first_name: normalizedShippingAddress.firstName,
				shipping_last_name: normalizedShippingAddress.lastName,
				shipping_email: normalizedShippingAddress.email,
				shipping_phone: normalizedShippingAddress.phone || "",
				shipping_country: normalizedShippingAddress.country,
				shipping_region: normalizedShippingAddress.region,
				shipping_address1: normalizedShippingAddress.address1,
				shipping_address2: normalizedShippingAddress.address2 || "",
				shipping_city: normalizedShippingAddress.city,
				shipping_zip: normalizedShippingAddress.zip,
				printify_shipping_cents: printifyShippingAmount.toString(),
				printify_shipping_option: shippingOptionId,
				printify_shipping_method: selectedShippingMethod,
			},
		};
		const session = await stripe.checkout.sessions.create(sessionParams);

		if (!session.client_secret) {
			throw new Error("Failed to create checkout session");
		}

		return session.client_secret;
	} catch (error) {
		console.error("Checkout error:", error);
		throw error;
	}
}
