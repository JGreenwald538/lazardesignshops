import ClearCartButton from "@/app/components/ClearCartButton";
import ReviewItem from "@/app/components/ReviewItem";
import TopBar from "@/app/components/TopBar";
import { GetCart, GetCartTotal } from "@/app/utils/Cart";
import Link from "next/link";
import { FaArrowRightLong } from "react-icons/fa6";

export default async function Checkout() {
	const cart = await GetCart();
	const total = await GetCartTotal();
	return (
		<div className="min-h-screen pb-10">
			<TopBar />
			<div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 pt-6 lg:px-6">
				<div className="glass-panel flex flex-col gap-4 rounded-[2.2rem] p-6 lg:flex-row lg:items-end lg:justify-between">
					<div>
						<div className="text-xs uppercase tracking-[0.35em] text-[#7a716a]">Shopping cart</div>
						<div className="display-font text-4xl text-[#141110]">Review your order</div>
						<div className="mt-2 text-[#5f5650]">
							You have <span className="font-bold text-[#141110]">{cart.length}</span> items in your cart.
						</div>
					</div>
					{cart.length > 0 && <ClearCartButton />}
				</div>

				<div className="flex flex-col gap-4">
					{cart.length === 0 ? (
						<div id="checkout" className="glass-panel flex h-64 items-center justify-center rounded-[2rem] text-lg">
							Your cart is empty.
						</div>
					) : (
						<div className="flex flex-col gap-4">
							{cart.map((item, index) => (
								<ReviewItem key={index} item={item} index={index} />
							))}
						</div>
					)}
				</div>

				<Link className="store-button flex justify-center pb-2" href="/checkout">
					<div className="flex w-full flex-wrap items-center justify-between gap-3 rounded-[1.6rem] bg-[#141110] px-5 py-4 text-white shadow-lg shadow-[#141110]/15 lg:w-3/4">
						<div className="text-lg font-semibold">Total ${total}</div>
						<div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.2em]">
							<div>Checkout</div>
							<FaArrowRightLong />
						</div>
					</div>
				</Link>
			</div>
		</div>
	);
}
