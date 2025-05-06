"use server";

import { headers } from "next/headers";
import { stripe } from "./Stripe";
import { GetCart } from "./Cart";

export async function fetchClientSecret() {
	try {
		const origin = (await headers()).get("origin");
		const cart = await GetCart();

		// Validate cart data
		if (!cart || !Array.isArray(cart) || cart.length === 0) {
			throw new Error("Cart is empty or invalid");
		}

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

		// Create Checkout Session
		const session = await stripe.checkout.sessions.create({
			ui_mode: "embedded",
			line_items: lineItems,
			mode: "payment",
			return_url: `${origin}/return?session_id={CHECKOUT_SESSION_ID}`,
		});

		if (!session.client_secret) {
			throw new Error("Failed to create checkout session");
		}

		return session.client_secret;
	} catch (error) {
		console.error("Checkout error:", error);
		throw error;
	}
}
