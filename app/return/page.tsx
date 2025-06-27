"use server";

import { redirect } from "next/navigation";
import { stripe } from "../utils/Stripe";
import { EmptyCart, GetCart } from "../utils/Cart";
import ClearCartButton from "../components/ClearCartButton";
import TopBar from "../components/TopBar";
import { cookies } from "next/headers";
import ClearCartOnMount from "../components/ClearCartOnMount";

const STORE_ID = process.env.PRINTIFY_STORE_ID;
const API_KEY = process.env.PRINTIFY_API_KEY;

export default async function Return({
	searchParams,
}: {
	searchParams: Promise<{ session_id: string }>;
}) {
	const { session_id } = await searchParams;

	if (!session_id)
		throw new Error("Please provide a valid session_id (`cs_test_...`)");

	const session = await stripe.checkout.sessions.retrieve(session_id, {
		expand: ["line_items", "payment_intent"],
	});

	const { status, customer_details } = session;
	const customerEmail = customer_details?.email || "unknown";

	if (status === "complete") {
		const cart = await GetCart();

		const lineItems = cart.map((item) => {
			return {
				variant_id: item.variantID,
				quantity: item.quantity,
				product_id: item.id.trim(),
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
			if (process.env.VERCEL_ENV === "production") {
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
				}
			}

		} catch (error) {
			console.error("Error creating Printify order:", error);
		}

		return (
			<div
				className="relative h-screen bg-[#fef7ef] overflow-hidden flex flex-col"
				id="success"
			>
				<ClearCartOnMount />
				<TopBar />

				{/* Decorative SVG shapes */}
				<div className="absolute top-40 w-[350px] z-10 lg:visible hidden">
					<svg
						width="351"
						height="395"
						viewBox="0 0 351 395"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
					>
						<ellipse
							cx="27.38"
							cy="197.27"
							rx="329.51"
							ry="185.99"
							transform="rotate(-13.81 27.38 197.27)"
							fill="#EDEA88"
						/>
					</svg>
				</div>

				<div className="absolute bottom-0 w-[275px] z-10">
					<svg
						width="275"
						height="290"
						viewBox="0 0 275 290"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							d="M120.677 13.864C144.961 -10.733 186.759 0.0948213 196.046 33.3885L273.123 309.709C282.44 343.113 252.063 374.058 218.492 365.362L-60.1276 293.184C-93.6987 284.487 -105.23 242.685 -80.8658 218.006L120.677 13.864Z"
							fill="#D67070"
						/>
					</svg>
				</div>

				<div className="absolute right-10 top-36 w-[312px] z-10">
					<svg
						width="312"
						height="287"
						viewBox="0 0 312 287"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
					>
						<rect
							x="46.328"
							y="-10"
							width="283"
							height="250"
							rx="54"
							transform="rotate(13.0212 46.328 -10)"
							fill="#7AC48C"
						/>
					</svg>
				</div>

				<div className="absolute bottom-10 right-10 w-[354px] z-10 lg:visible hidden">
					<svg
						width="354"
						height="338"
						viewBox="0 0 354 338"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							d="M112.341 40.2997C153.817 -18.8006 243.673 -11.0162 274.367 54.3363L344.31 203.254C375.106 268.823 323.284 343.116 251.114 336.864L86.6613 322.617C14.4906 316.365 -23.7822 234.266 17.8311 174.97L112.341 40.2997Z"
							fill="#709BD6"
						/>
					</svg>
				</div>

				{/* Main Content */}
				<div className="flex-1 flex flex-col items-center justify-center text-center px-4 z-10">
					<h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#111132] leading-tight">
						YOU REALLY CAN’T GET ENOUGH OF ME
						<br />
						<span className="text-6xl sm:text-7xl md:text-8xl mt-4 block">
							CAN YOU
						</span>
					</h1>
					<p className="mt-8 text-xl sm:text-2xl text-[#111132] font-medium">
						(Thank you for purchasing works from <br />
						LazarDesigns, cherish them... I sure do)
					</p>
				</div>
			</div>
		);
	}

	// Fallback for other statuses
	return redirect("/");
}
