"use server";

import { cookies } from "next/headers";

export async function AddToCart(
	variantID: number,
	quantity: number,
	price: number,
    name: string,
    id: string
) {
	const cookieStore = await cookies();
	const currentCart: { variantID: number; price: number, quantity: number, name: string, id: string }[] = JSON.parse(
		cookieStore.get("cart")?.value || "[]"
	);
    const indexOfVariant = currentCart.findIndex((variant)=> variant.variantID === variantID)
    if(indexOfVariant === -1) {
        currentCart.push({ variantID, price, quantity, name, id });
    } else {
        currentCart[indexOfVariant] = {variantID, price, quantity: currentCart[indexOfVariant].quantity + quantity, name, id}
    }
	cookieStore.set("cart", JSON.stringify(currentCart));
    console.log(currentCart)
}

export async function NumberInCart() {
	const cookieStore = await cookies();
	const currentCart: { variantID: number; price: number, quantity: number, name: string, id: string }[] = JSON.parse(
		cookieStore.get("cart")?.value || "[]"
	);
    let quantities = 0;
    for(const item in currentCart) {
        quantities += currentCart[item].quantity;
    }
	return quantities;
}

export async function GetCart() {
    const cookieStore = await cookies();
    const currentCart: { variantID: number; price: number, quantity: number, name: string, id: string }[] = JSON.parse(
		cookieStore.get("cart")?.value || "[]"
	);
    return currentCart;
}

export async function EmptyCart() {
    const cookieStore = await cookies();
    cookieStore.delete("cart");
}