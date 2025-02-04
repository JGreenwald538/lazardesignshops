import ShopItem from "./components/ShopItem";
import TopBar from "./components/TopBar";

export default function Home() {
  return (
		<div className="w-screen">
			<TopBar />
			<div className="grid xl:grid-cols-3 lg:grid-cols-2 grid-cols-1 w-full items-center justify-center mb-6 sm:mx-4">
				<ShopItem />
				<ShopItem />
				<ShopItem />
				<ShopItem />
				<ShopItem />
				<ShopItem />
			</div>
		</div>
	);
}
