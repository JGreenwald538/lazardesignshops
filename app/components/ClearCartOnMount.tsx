// app/components/ClearCartOnMount.tsx
"use client";

import { useEffect } from "react";
import { EmptyCart } from "../utils/Cart";

export default function ClearCartOnMount() {
	useEffect(() => {
		// Call the server action from client side
		EmptyCart();
	}, []);

	return null;
}
