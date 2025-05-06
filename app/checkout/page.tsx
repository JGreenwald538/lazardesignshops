"use client";

import {
	EmbeddedCheckout,
	EmbeddedCheckoutProvider,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

import { fetchClientSecret } from "../utils/StripeAction";

const stripePromise = loadStripe(
	process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || ""
);
import TopBar from "../components/TopBar";
import { useEffect, useState } from "react";
import { NumberInCart } from "../utils/Cart";

export default function Checkout() {
	const [cartSize, setCartSize] = useState(0);
	const [isLoading, setIsLoading] = useState(true);

	// Use useEffect to call the server function after initial render
	useEffect(() => {
		const fetchCartSize = async () => {
			try {
				const size = await NumberInCart();
				setCartSize(size);
			} catch (error) {
				console.error("Error fetching cart size:", error);
			} finally {
				setIsLoading(false);
			}
		};

		fetchCartSize();
	}, []);

	// Show a loading state while fetching cart size
	if (isLoading) {
		return (
			<div>
				<TopBar />
				<div id="checkout" className="flex justify-center items-center h-64">
					Loading checkout...
				</div>
			</div>
		);
	}

	return (
		<div>
			<TopBar />
			<div id="checkout">
				{cartSize !== 0 ? (
					<EmbeddedCheckoutProvider
						stripe={stripePromise}
						options={{ fetchClientSecret }}
					>
						<EmbeddedCheckout className="h-full" />
					</EmbeddedCheckoutProvider>
				) : (
					<div className="flex justify-center items-center h-64 text-lg">
						Your cart is empty
					</div>
				)}
			</div>
		</div>
	);
}
