"use server";

import { cookies } from "next/headers";

export async function AddToCart(variantID: number, quantity: number) {
    const cookieStore = await cookies();
    const currentCart:number[] = JSON.parse(cookieStore.get("cart")?.value || "[]");
    for(let i = 0; i < quantity; i++) {
        currentCart.push(variantID)
    }
    cookieStore.set("cart", JSON.stringify(currentCart));
    console.log(currentCart)
}

export async function NumberInCart() {
    const cookieStore = await cookies();
    const currentCart:number[] = JSON.parse(cookieStore.get("cart")?.value || "[]"); 
    return currentCart.length;
}