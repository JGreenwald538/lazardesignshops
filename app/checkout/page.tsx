"use client";

import {
	EmbeddedCheckout,
	EmbeddedCheckoutProvider,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

import { fetchClientSecret, fetchShippingOptions } from "../utils/StripeAction";

const stripePromise = loadStripe(
	process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || ""
);
import TopBar from "../components/TopBar";
import { FormEvent, useEffect, useState } from "react";
import { NumberInCart } from "../utils/Cart";
import type {
	PrintifyShippingOption,
	PrintifyShippingOptionId,
	ShippingAddress,
} from "../utils/PrintifyShipping";

const initialShippingAddress: ShippingAddress = {
	firstName: "",
	lastName: "",
	email: "",
	phone: "",
	address1: "",
	address2: "",
	city: "",
	region: "",
	zip: "",
	country: "US",
};

export default function Checkout() {
	const [cartSize, setCartSize] = useState(0);
	const [isLoading, setIsLoading] = useState(true);
	const [shippingAddress, setShippingAddress] = useState(initialShippingAddress);
	const [clientSecret, setClientSecret] = useState("");
	const [checkoutError, setCheckoutError] = useState("");
	const [isPreparingCheckout, setIsPreparingCheckout] = useState(false);
	const [shippingOptions, setShippingOptions] = useState<
		PrintifyShippingOption[]
	>([]);
	const [selectedShippingOption, setSelectedShippingOption] =
		useState<PrintifyShippingOptionId>("standard");

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

	const updateShippingAddress = (field: keyof ShippingAddress, value: string) => {
		setShippingAddress((currentAddress) => ({
			...currentAddress,
			[field]: field === "region" ? value.toUpperCase() : value,
		}));
		setShippingOptions([]);
		setClientSecret("");
	};

	const formatShippingAmount = (amount: number) => {
		if (amount === 0) return "Free";
		return `$${(amount / 100).toFixed(2)}`;
	};

	const handleShippingSubmit = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setCheckoutError("");
		setIsPreparingCheckout(true);

		try {
			if (shippingOptions.length === 0) {
				const options = await fetchShippingOptions(shippingAddress);
				setShippingOptions(options);
				setSelectedShippingOption(options[0]?.id || "standard");
				return;
			}

			const secret = await fetchClientSecret(
				shippingAddress,
				selectedShippingOption,
			);
			setClientSecret(secret);
		} catch (error) {
			console.error("Error preparing checkout:", error);
			setCheckoutError(
				error instanceof Error
					? error.message
					: "Could not prepare checkout. Please check your shipping address.",
			);
		} finally {
			setIsPreparingCheckout(false);
		}
	};

	// Show a loading state while fetching cart size
	if (isLoading) {
		return (
			<div className="min-h-screen">
				<TopBar />
				<div id="checkout" className="mx-auto flex h-64 max-w-7xl items-center justify-center px-4">
					Loading checkout...
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen pb-10">
			<TopBar />
			<div id="checkout" className="mx-auto w-full max-w-7xl px-4 pt-6 lg:px-6">
				{cartSize !== 0 && clientSecret ? (
					<div className="glass-panel overflow-hidden rounded-[2.2rem] p-3">
						<EmbeddedCheckoutProvider
							stripe={stripePromise}
							options={{
								fetchClientSecret: async () => clientSecret,
							}}
						>
							<EmbeddedCheckout className="h-full" />
						</EmbeddedCheckoutProvider>
					</div>
				) : cartSize !== 0 ? (
					<form
						onSubmit={handleShippingSubmit}
						className="glass-panel mx-auto flex max-w-3xl flex-col gap-5 rounded-[2.2rem] p-5 md:p-8"
					>
						<div>
							<div className="text-xs uppercase tracking-[0.35em] text-[#7a716a]">
								Shipping
							</div>
							<h1 className="display-font mt-1 text-4xl text-[#141110]">
								Where should this go?
							</h1>
						</div>

						<div className="grid gap-4 md:grid-cols-2">
							<label className="flex flex-col gap-2 text-sm font-semibold text-[#141110]">
								First name
								<input
									required
									className="rounded-2xl border border-[#141110]/10 bg-white px-4 py-3 font-normal outline-none focus:border-[#141110]"
									value={shippingAddress.firstName}
									onChange={(event) =>
										updateShippingAddress("firstName", event.target.value)
									}
								/>
							</label>
							<label className="flex flex-col gap-2 text-sm font-semibold text-[#141110]">
								Last name
								<input
									required
									className="rounded-2xl border border-[#141110]/10 bg-white px-4 py-3 font-normal outline-none focus:border-[#141110]"
									value={shippingAddress.lastName}
									onChange={(event) =>
										updateShippingAddress("lastName", event.target.value)
									}
								/>
							</label>
							<label className="flex flex-col gap-2 text-sm font-semibold text-[#141110]">
								Email
								<input
									required
									type="email"
									className="rounded-2xl border border-[#141110]/10 bg-white px-4 py-3 font-normal outline-none focus:border-[#141110]"
									value={shippingAddress.email}
									onChange={(event) =>
										updateShippingAddress("email", event.target.value)
									}
								/>
							</label>
							<label className="flex flex-col gap-2 text-sm font-semibold text-[#141110]">
								Phone
								<input
									type="tel"
									className="rounded-2xl border border-[#141110]/10 bg-white px-4 py-3 font-normal outline-none focus:border-[#141110]"
									value={shippingAddress.phone}
									onChange={(event) =>
										updateShippingAddress("phone", event.target.value)
									}
								/>
							</label>
							<label className="flex flex-col gap-2 text-sm font-semibold text-[#141110] md:col-span-2">
								Address
								<input
									required
									className="rounded-2xl border border-[#141110]/10 bg-white px-4 py-3 font-normal outline-none focus:border-[#141110]"
									value={shippingAddress.address1}
									onChange={(event) =>
										updateShippingAddress("address1", event.target.value)
									}
								/>
							</label>
							<label className="flex flex-col gap-2 text-sm font-semibold text-[#141110] md:col-span-2">
								Apartment, suite, etc.
								<input
									className="rounded-2xl border border-[#141110]/10 bg-white px-4 py-3 font-normal outline-none focus:border-[#141110]"
									value={shippingAddress.address2}
									onChange={(event) =>
										updateShippingAddress("address2", event.target.value)
									}
								/>
							</label>
							<label className="flex flex-col gap-2 text-sm font-semibold text-[#141110]">
								City
								<input
									required
									className="rounded-2xl border border-[#141110]/10 bg-white px-4 py-3 font-normal outline-none focus:border-[#141110]"
									value={shippingAddress.city}
									onChange={(event) =>
										updateShippingAddress("city", event.target.value)
									}
								/>
							</label>
							<div className="grid min-w-0 grid-cols-[minmax(0,0.8fr)_minmax(0,1fr)] gap-3">
								<label className="flex min-w-0 flex-col gap-2 text-sm font-semibold text-[#141110]">
									State
									<input
										required
										maxLength={2}
										className="min-w-0 rounded-2xl border border-[#141110]/10 bg-white px-4 py-3 font-normal uppercase outline-none focus:border-[#141110]"
										value={shippingAddress.region}
										onChange={(event) =>
											updateShippingAddress("region", event.target.value)
										}
									/>
								</label>
								<label className="flex min-w-0 flex-col gap-2 text-sm font-semibold text-[#141110]">
									ZIP
									<input
										required
										inputMode="numeric"
										className="min-w-0 rounded-2xl border border-[#141110]/10 bg-white px-4 py-3 font-normal outline-none focus:border-[#141110]"
										value={shippingAddress.zip}
										onChange={(event) =>
											updateShippingAddress("zip", event.target.value)
										}
									/>
								</label>
							</div>
						</div>

						{checkoutError && (
							<div className="rounded-2xl border border-[#b04a37]/20 bg-[#b04a37]/10 px-4 py-3 text-sm font-semibold text-[#8a3324]">
								{checkoutError}
							</div>
						)}

						{shippingOptions.length > 0 && (
							<div className="flex flex-col gap-3 rounded-3xl border border-[#141110]/10 bg-white/55 p-4">
								<div className="text-xs font-semibold uppercase tracking-[0.3em] text-[#7a716a]">
									Shipping speed
								</div>
								<div className="grid gap-3">
									{shippingOptions.map((option) => (
										<label
											key={option.id}
											className={`flex cursor-pointer items-center justify-between gap-3 rounded-2xl border px-4 py-3 transition ${
												selectedShippingOption === option.id
													? "border-[#141110] bg-white shadow-sm"
													: "border-[#141110]/10 bg-white/70 hover:border-[#141110]/30"
											}`}
										>
											<div className="flex items-center gap-3">
												<input
													type="radio"
													name="shippingOption"
													value={option.id}
													checked={selectedShippingOption === option.id}
													onChange={() => setSelectedShippingOption(option.id)}
													className="h-4 w-4 accent-[#141110]"
												/>
												<span className="font-semibold text-[#141110]">
													{option.label}
												</span>
											</div>
											<span className="font-bold text-[#141110]">
												{formatShippingAmount(option.amount)}
											</span>
										</label>
									))}
								</div>
							</div>
						)}

						<button
							type="submit"
							disabled={isPreparingCheckout}
							className="store-button rounded-[1.6rem] bg-[#141110] px-5 py-4 text-sm font-semibold uppercase tracking-[0.2em] text-white shadow-lg shadow-[#141110]/15 disabled:cursor-not-allowed disabled:opacity-60"
						>
							{isPreparingCheckout
								? "Calculating shipping..."
								: shippingOptions.length > 0
									? "Continue to payment"
									: "Show shipping options"}
						</button>
					</form>
				) : (
					<div className="glass-panel mt-8 flex h-64 items-center justify-center rounded-[2rem] text-lg">
						Your cart is empty
					</div>
				)}
			</div>
		</div>
	);
}
