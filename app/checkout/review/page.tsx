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
		<div className="h-screen">
			<TopBar />
			<div className="flex flex-col flex-1 overflow-auto">
				<div className="mx-10 my-10 flex flex-col">
					<div className="flex mb-4 justify-between lg:flex-row flex-col lg:items-center items-start">
						<div>
							<div className="">Shopping Cart</div>
							<div>
								You have{" "}
								<div className="inline font-bold text-lg">{cart.length}</div>{" "}
								items in your cart
							</div>
						</div>
						{cart.length > 0 && <ClearCartButton />}
					</div>
					<div className="flex flex-col">
						{cart.length === 0 ? (
							<div
								id="checkout"
								className="flex justify-center items-center h-64"
							>
								Your cart is empty.
							</div>
						) : (
							<div className="flex space-y-4 flex-col mb-10">
								{cart.map((item, index) => (
									<ReviewItem key={index} item={item} index={index} />
								))}
							</div>
						)}
					</div>
				</div>
				<Link className="flex justify-center pb-10 hover:transform hover:scale-105 transition" href={"/checkout"}>
					<div className="flex justify-between bg-[#CC6060] w-3/4 py-4 px-4 rounded-xl text-white">
						<div>Total ${total}</div>
						<div className="flex items-center flex-row">
							<div>Checkout</div>
							<FaArrowRightLong className="inline ml-2" />
						</div>
					</div>
				</Link>
			</div>
		</div>
	);
}
