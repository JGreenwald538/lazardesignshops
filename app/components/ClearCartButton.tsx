"use client";

import { EmptyCart } from "../utils/Cart";

export default function ClearCartButton() {
	return (
		<button
			onClick={async () => {
				await EmptyCart();
			}}
			className="bg-black text-white px-4 py-2 rounded-md mt-4"
		>
			Clear Cart
		</button>
	);
}
