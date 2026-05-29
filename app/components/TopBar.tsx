"use client"

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FaShoppingCart } from "react-icons/fa";
import { NumberInCart } from "../utils/Cart";

export default function TopBar() {
	const [cartNumber, setCartNumber] = useState(0);

	useEffect(() => {
		let isMounted = true;
		NumberInCart().then((number) => {
			if (isMounted) {
				setCartNumber(number);
			}
		});

		return () => {
			isMounted = false;
		};
	}, []);
	return (
		<div className="sticky top-0 z-50 w-full px-3 pt-3 sm:px-6 lg:px-8">
			<div className="glass-panel mx-auto grid w-full max-w-7xl grid-cols-[1fr_auto] items-center gap-3 rounded-3xl px-3 py-3 sm:px-4 lg:flex lg:rounded-[2rem] lg:px-6 lg:py-4">
				<Link href="/" className="flex min-w-0 items-center">
					<div className="flex h-12 w-44 max-w-full items-center justify-center px-1 sm:h-14 sm:w-54">
						<Image
							src="/LazarD.PlainBlack.png"
							alt="LazarDesigns"
							width={4574}
							height={2092}
							className="h-auto w-full object-contain"
						/>
					</div>
				</Link>

				<div className="order-3 col-span-2 grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:items-center sm:gap-3 lg:order-none lg:flex-1 lg:justify-center lg:px-6">
					<Link
						className="store-button rounded-full border border-[#141110]/10 bg-white/70 px-3 py-2 text-center text-xs font-semibold tracking-wide text-[#141110] shadow-sm hover:border-[#d15b43]/35 hover:bg-white sm:px-5 sm:text-sm"
						href="/?f=posters"
					>
						Posters
					</Link>
					<Link
						className="store-button rounded-full border border-[#141110]/10 bg-white/70 px-3 py-2 text-center text-xs font-semibold tracking-wide text-[#141110] shadow-sm hover:border-[#d15b43]/35 hover:bg-white sm:px-5 sm:text-sm"
						href="/?f=tshirts"
					>
						T-Shirts
					</Link>
					<Link
						className="store-button rounded-full border border-[#141110]/10 bg-white/70 px-3 py-2 text-center text-xs font-semibold tracking-wide text-[#141110] shadow-sm hover:border-[#d15b43]/35 hover:bg-white sm:px-5 sm:text-sm"
						href="/customorder"
					>
						Custom Order
					</Link>
					<Link
						className="store-button rounded-full border border-[#141110]/10 bg-white/70 px-3 py-2 text-center text-xs font-semibold tracking-wide text-[#141110] shadow-sm hover:border-[#d15b43]/35 hover:bg-white sm:px-5 sm:text-sm"
						href="/contact"
					>
						Contact
					</Link>
				</div>

				<div className="flex items-center gap-3 justify-self-end lg:self-auto">
					<div className="hidden text-right lg:block">
						<div className="text-xs uppercase tracking-[0.3em] text-[#6a625d]">
							Ready to ship
						</div>
						<div className="text-sm font-semibold text-[#141110]">
							$35+ free shipping
						</div>
					</div>
					<Link
						className="store-button relative inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#141110] text-white shadow-lg shadow-[#141110]/20 hover:bg-accent_light hover:text-foreground sm:h-12 sm:w-12"
						href="/checkout/review"
					>
						{cartNumber !== 0 && (
							<div className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#d15b43] px-1 text-xs font-bold text-white">
								{cartNumber}
							</div>
						)}
						<FaShoppingCart className="text-lg" />
					</Link>
				</div>
			</div>
		</div>
	);
}
