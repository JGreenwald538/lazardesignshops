"use server";

import { cookies } from "next/headers";

export async function AddToCart(
	variantID: number,
	quantity: number,
	price: number,
	name: string,
	id: string,
	images: string[]
) {
	const cookieStore = await cookies();
	const currentCart: {
		variantID: number;
		price: number;
		quantity: number;
		name: string;
		id: string;
		images: string[];
	}[] = JSON.parse(cookieStore.get("cart")?.value || "[]");
	const indexOfVariant = currentCart.findIndex(
		(variant) => variant.variantID === variantID
	);
	if (indexOfVariant === -1) {
		currentCart.push({ variantID, price, quantity, name, id, images });
	} else {
		currentCart[indexOfVariant] = {
			variantID,
			price,
			quantity: currentCart[indexOfVariant].quantity + quantity,
			name,
			id,
			images,
		};
	}

	console.log(JSON.stringify(currentCart).split("").length + 4 )
	if(JSON.stringify(currentCart).split("").length + 4 > 2300) {
		return "Cart is too large";
	} else {
		cookieStore.delete("cart"); // Clear existing cart cookie to avoid duplicates
		cookieStore.set("cart", JSON.stringify(currentCart).trim());
	}
}

export async function NumberInCart() {
	const cookieStore = await cookies();
	const currentCart: {
		variantID: number;
		price: number;
		quantity: number;
		name: string;
		id: string;
		images: string[];
	}[] = JSON.parse(cookieStore.get("cart")?.value || "[]");
	let quantities = 0;
	for (const item in currentCart) {
		quantities += currentCart[item].quantity;
	}
	return quantities;
}

export async function GetCart() {
	const cookieStore = await cookies();
	const currentCart: {
		variantID: number;
		price: number;
		quantity: number;
		name: string;
		id: string;
		images: string[];
	}[] = JSON.parse(cookieStore.get("cart")?.value || "[]");
	return currentCart;
}

export async function EmptyCart() {
	const cookieStore = await cookies();
	cookieStore.delete("cart");
}

export async function SetItemQuantity(variantID:number, quantity:number) {
	const cookieStore = await cookies();
	const currentCart: {
		variantID: number;
		price: number;
		quantity: number;
		name: string;
		id: string;
		images: string[];
	}[] = JSON.parse(cookieStore.get("cart")?.value || "[]");
	currentCart[currentCart.findIndex((item)=>item.variantID === variantID)].quantity = quantity;
	cookieStore.set("cart", JSON.stringify(currentCart));
}

export async function RemoveItem(variantID: number) {
	const cookieStore = await cookies();
	const currentCart: {
		variantID: number;
		price: number;
		quantity: number;
		name: string;
		id: string;
		images: string[];
	}[] = JSON.parse(cookieStore.get("cart")?.value || "[]");
	const index = currentCart.findIndex((item) => item.variantID === variantID);
	if (index !== -1) {
		currentCart.splice(index, 1);
		cookieStore.set("cart", JSON.stringify(currentCart));
	}
}

export async function GetCartTotal() {
	const cookieStore = await cookies();
	const currentCart: {
		variantID: number;
		price: number;
		quantity: number;
		name: string;
		id: string;
		images: string[];
	}[] = JSON.parse(cookieStore.get("cart")?.value || "[]");
	let total = 0;
	for (const item of currentCart) {
		total += item.price * item.quantity;
	}
	return total;
}