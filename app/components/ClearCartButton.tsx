"use client";

import { EmptyCart } from "../utils/Cart";

export default function ClearCartButton() {
	return (
		<button
			onClick={async () => {
				if (window.confirm("Are you sure you want to clear the cart?")) {
					await EmptyCart();
				}
			}}
			className="bg-[#e35050] text-white px-4 py-2 rounded-md mt-4"
		>
			Clear Cart
		</button>
	);
}
