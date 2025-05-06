import { redirect } from "next/navigation";
import { stripe } from "../utils/Stripe";
import { EmptyCart, GetCart } from "../utils/Cart";

const STORE_ID = process.env.PRINTIFY_STORE_ID;
const API_KEY = process.env.PRINTIFY_API_KEY;

export default async function Return({
	searchParams,
}: {
	searchParams: { session_id: string };
}) {
	const { session_id } = await searchParams;

	if (!session_id)
		throw new Error("Please provide a valid session_id (`cs_test_...`)");

	const session = await stripe.checkout.sessions.retrieve(session_id, {
		expand: ["line_items", "payment_intent"],
	});

	const { status, customer_details } = session;
	const customerEmail = customer_details?.email || "unknown";

	if (status === "open") {
		return redirect("/");
	}

	if (status === "complete") {
		const cart = await GetCart();

		// Check if cart is empty and handle appropriately
		if (!cart || cart.length === 0) {
			return (
				<section id="success">
					<p>
						Your payment was successful, but we couldn't find your cart items. A
						confirmation email will be sent to {customerEmail}. If you have any
						questions, please contact our support team.
					</p>
					<a href="mailto:orders@example.com">orders@example.com</a>
				</section>
			);
		}

		const lineItems = cart.map((item) => {
			return {
				variant_id: item.variantID,
				quantity: item.quantity,
				product_id: item.id.trim()
			};
		});

		// Safely access customer details with fallbacks for all fields
		const firstName = customer_details?.name?.split(" ")[0] || "";
		const lastName =
			customer_details?.name?.split(" ").slice(1).join(" ") || "";

		const order = {
			external_id: session_id,
			line_items: lineItems,
			shipping_method: 1,
			send_shipping_notification: true,
			address_to: {
				first_name: firstName,
				last_name: lastName,
				email: customerEmail,
				phone: customer_details?.phone || "",
				country: customer_details?.address?.country || "",
				region: customer_details?.address?.state || "",
				address1: customer_details?.address?.line1 || "",
				address2: customer_details?.address?.line2 || "",
				city: customer_details?.address?.city || "",
				zip: customer_details?.address?.postal_code || "",
			},
		};

		try {
			const response = await fetch(
				`https://api.printify.com/v1/shops/${STORE_ID}/orders.json`,
				{
					method: "POST",
					headers: {
						Authorization: `Bearer ${API_KEY}`,
						"Content-Type": "application/json",
					},
					body: JSON.stringify(order),
				}
			);

			// Parse response body to get detailed error
			const responseData = await response.json();

			if (!response.ok) {
				console.error("Printify API Error:", responseData);

				// Still return success to user, but log the error for admins
				return (
					<section id="success">
						<h1>Order Received</h1>
						<p>
							Thank you for your order! A confirmation email will be sent to{" "}
							{customerEmail}. Our team will process your order shortly.
						</p>
						<p>
							If you have any questions, please email{" "}
							<a href="mailto:orders@example.com">orders@example.com</a>.
						</p>
						<a href="/" className="button">
							Continue Shopping
						</a>
					</section>
				);
			}

			// Success! Empty the cart
			// await EmptyCart();

			return (
				<section id="success">
					<h1>Order Complete!</h1>
					<p>
						We appreciate your business! A confirmation email will be sent to{" "}
						{customerEmail}. If you have any questions, please email{" "}
						<a href="mailto:orders@example.com">orders@example.com</a>.
					</p>
					<a href="/" className="button">
						Continue Shopping
					</a>
				</section>
			);
		} catch (error) {
			console.error("Error creating Printify order:", error);

			return (
				<section id="success">
					<h1>Order Received</h1>
					<p>
						Thank you for your purchase! A confirmation email will be sent to{" "}
						{customerEmail}. Our team will manually process your order.
					</p>
					<p>
						If you have any questions, please contact{" "}
						<a href="mailto:orders@example.com">orders@example.com</a>.
					</p>
					<a href="/" className="button">
						Continue Shopping
					</a>
				</section>
			);
		}
	}

	// Fallback for other statuses
	return redirect("/");
}
