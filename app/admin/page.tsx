"use client";

import { useEffect, useState } from "react";
import PrintifyProduct from "../utils/PrintifyProduct";

import { checkPassword } from "../utils/CheckPassword";

export default function AdminPage() {
	const [tshirts, setTshirts] = useState<PrintifyProduct[]>([]);
	const [posters, setPosters] = useState<PrintifyProduct[]>([]);
	const [password, setPassword] = useState<string>("");
	const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
	useEffect(() => {
		fetchInitialProducts(setTshirts, setPosters);
	}, []);

	const handlePasswordSubmit = () => {
		checkPassword(password)
			.then((isValid) => {
				setIsAuthenticated(isValid);
				if (isValid) {
					alert("Password is correct");
				} else {
					alert("Incorrect password");
				}
			})
			.catch((error) => {
				console.error("Error checking password:", error);
				alert("An error occurred while checking the password.");
			});
	};

	return (
		<div>
			{(isAuthenticated ? (
				<div className="flex flex-col items-center justify-center h-screen">
					<h1 className="text-4xl font-bold mb-4">Admin Page</h1>
					<div>
						<button
							className="bg-blue-300 rounded px-2 py-1"
							onClick={async () => {
								fetchInitialProducts(setTshirts, setPosters);
								// for (const tshirt of tshirts) {
								//     updateTshirt(tshirt);
								// }
								for (const poster of posters) {
									await fetch("/api/printify/update-poster", {
										method: "POST",
										headers: {
											"Content-Type": "application/json",
										},
										body: JSON.stringify({
											id: poster.id,
											description: poster.description,
											images: poster.images,
										}),
									});
								}
								for (const tshirt of tshirts) {
									await fetch("/api/printify/update-tshirt", {
										method: "POST",
										headers: {
											"Content-Type": "application/json",
										},
										body: JSON.stringify({
											id: tshirt.id,
											description: tshirt.description,
											images: tshirt.images,
										}),
									});
								}
							}}
						>
							Sync With Printify
						</button>
					</div>
				</div>
			) : (
				<div className="flex flex-col items-center justify-center h-screen">
					<h1 className="text-4xl font-bold mb-4">Admin Page</h1>
					<input
						type="password"
						placeholder="Enter password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						className="border border-gray-300 rounded px-2 py-1 mb-4"
					/>
					<button
						className="bg-blue-300 rounded px-2 py-1"
						onClick={handlePasswordSubmit}
					>
						Submit
					</button>
				</div>
			))}
		</div>
	);
}

const fetchInitialProducts = async (
	setTshirts: (products: PrintifyProduct[]) => void,
	setPosters: (products: PrintifyProduct[]) => void
) => {
	let posters: PrintifyProduct[] = [];
	let shirts: PrintifyProduct[] = [];
	try {
		const res = await fetch("/api/printify/tshirts");
		const data = await res.json();
		if (data.error) throw new Error(data.error);
		shirts = data;
	} catch (error) {
		console.error("Error fetching initial products:", error);
	}
	try {
		const res = await fetch("/api/printify/posters");
		const data = await res.json();
		if (data.error) throw new Error(data.error);
		posters = data;
	} catch (error) {
		console.error("Error fetching initial products:", error);
	}
	setTshirts(shirts);
	setPosters(posters);
};
