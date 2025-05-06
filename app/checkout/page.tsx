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
import { useState } from "react";
import { NumberInCart } from "../utils/Cart";

export default function Checkout() {
    const [cartSize, setCartSize] = useState(0)
    NumberInCart().then((size) => setCartSize(size))
    
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
					<div>Cart is empty</div>
				)}
			</div>
		</div>
	);
}
