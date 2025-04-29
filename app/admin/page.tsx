"use client";

import { useEffect, useRef, useState } from "react";
import PrintifyProduct from "../utils/PrintifyProduct";

import { checkPassword } from "../utils/CheckPassword";
import { DataRowTshirt } from "../utils/DataRowTshirt";
import { DataRowPoster } from "../utils/DataRowPoster";
const tshirtHeader = [
	"ID",
	"Product Name",
	"Small Price",
	"Medium Price",
	"Large Price",
	"XL Price",
	"2XL Price",
	"3XL Price",
];

const posterHeader = [
	"ID",
	"Product Name",
	'"11""x14"" Price"',
	'"12""x16"" Price"',
	'"16""x20"" Price"',
	'"20""x24"" Price"',
	'"18""x24"" Price"',
	'"24""x32"" Price"',
];

export default function AdminPage() {
	const [tshirts, setTshirts] = useState<PrintifyProduct[]>([]);
	const [posters, setPosters] = useState<PrintifyProduct[]>([]);
	const [password, setPassword] = useState<string>("");
	const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
	useEffect(() => {
		fetchInitial(setTshirts, setPosters);
	}, []);
	const [tshirtsCSV, setTshirtsCSV] = useState<DataRowTshirt[]>([]);
	const [postersCSV, setPostersCSV] = useState<DataRowPoster[]>([]);
	const tshirtInputRef = useRef<HTMLInputElement | null>(null);
	const posterInputRef = useRef<HTMLInputElement | null>(null);

	const handlePasswordSubmit = (first: boolean) => {
		checkPassword(password)
			.then(async (isValid) => {
				setIsAuthenticated(isValid);
				if (!isValid && !first) {
					alert("Incorrect password");
				}
			})
			.catch((error) => {
				if (!first) {
					console.error("Error checking password:", error);
					alert("An error occurred while checking the password.");
				}
			});
	};

	useEffect(() => {
		handlePasswordSubmit(true);
	});

	const addTshirtCSV = async () => {
		const allGood: { id: string; name: string }[] = [];
		for (const tshirt in tshirtsCSV) {
			const response = await fetch("/api/printify/add-tshirt", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					tshirt: tshirtsCSV[tshirt],
				}),
			});
			if (!response.ok) {
				allGood.push({
					id: tshirtsCSV[tshirt].ID,
					name: tshirtsCSV[tshirt]["Product Name"],
				});
			}
		}
		if (allGood) {
			alert(
				"There was an issue with:\n" +
					allGood
						.map((product) => {
							return product.id + ": " + product.name;
						})
						.join("\n")
			);
		} else {
			alert("Upload was successful");
		}
	};

	const addPosterCSV = async () => {
		const allGood: { id: string; name: string }[] = [];
		for (const poster in postersCSV) {
			const response = await fetch("/api/printify/add-poster", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					poster: postersCSV[poster],
				}),
			});
			if (!response.ok) {
				allGood.push({
					id: postersCSV[poster].ID,
					name: postersCSV[poster]["Product Name"],
				});
			}
		}
		if (allGood.length !== 0) {
			alert(
				"There was an issue with:\n" +
					allGood
						.map((product) => {
							return product.id + ": " + product.name;
						})
						.join("\n")
			);
		} else {
			alert("Upload was successful");
		}
	};

	return (
		<div>
			{isAuthenticated ? (
				<div className="flex flex-col items-center justify-center h-screen">
					<h1 className="text-4xl font-bold mb-4">Admin Page</h1>
					<div className="flex flex-col items-center space-y-10">
						<button
							className="bg-blue-300 rounded px-2 py-1 w-fit "
							onClick={async () => {
								fetchInitial(setTshirts, setPosters);
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
						<input
							type="file"
							accept=".csv"
							ref={tshirtInputRef}
							onChange={async (file) => {
								const rows: DataRowTshirt[] = [];
								if (file.target.files) {
									const tableText = await file.target.files[0].text();
									const tableSplit = tableText
										.split("\r\n")
										.map((row: string) => row.split(","));
									if (
										!tableSplit[0].every(
											(value: string, index: number) =>
												value === tshirtHeader[index]
										)
									) {
										alert("Invalid Input File");
										if (tshirtInputRef.current) {
											tshirtInputRef.current.value = "";
										}
									} else {
										for (let i = 1; i < tableSplit.length; i++) {
											const row: DataRowTshirt = {
												ID: tableSplit[i][0],
												"Product Name": tableSplit[i][1],
												"Small Price": parseFloat(
													tableSplit[i][2].replace(/[$]/g, "")
												),
												"Medium Price": parseFloat(
													tableSplit[i][3].replace(/[$]/g, "")
												),
												"Large Price": parseFloat(
													tableSplit[i][4].replace(/[$]/g, "")
												),
												"XL Price": parseFloat(
													tableSplit[i][5].replace(/[$]/g, "")
												),
												"2XL Price": parseFloat(
													tableSplit[i][6].replace(/[$]/g, "")
												),
												"3XL Price": parseFloat(
													tableSplit[i][7].replace(/[$]/g, "")
												),
											};
											rows.push(row);
										}
										setTshirtsCSV(rows);
									}
								}
							}}
						/>
						<button
							className="bg-blue-300 rounded px-2 py-1 w-fit"
							onClick={addTshirtCSV}
						>
							Submit TShirt CSV
						</button>
						<input
							type="file"
							accept=".csv"
							ref={posterInputRef}
							onChange={async (file) => {
								const rows: DataRowPoster[] = [];
								if (file.target.files) {
									const tableText = await file.target.files[0].text();
									const tableSplit = tableText
										.split("\r\n")
										.map((row: string) => row.split(","));
									if (
										!tableSplit[0].every(
											(value: string, index: number) =>
												value === posterHeader[index]
										)
									) {
										alert("Invalid Input File");
										if (posterInputRef.current) {
											posterInputRef.current.value = "";
										}
									} else {
										for (let i = 1; i < tableSplit.length; i++) {
											const row: DataRowPoster = {
												ID: tableSplit[i][0],
												"Product Name": tableSplit[i][1],
												'11"x14" Price': parseFloat(
													tableSplit[i][2].replace(/[$]/g, "")
												),
												'12"x16" Price': parseFloat(
													tableSplit[i][3].replace(/[$]/g, "")
												),
												'16"x20" Price': parseFloat(
													tableSplit[i][4].replace(/[$]/g, "")
												),
												'20"x24" Price': parseFloat(
													tableSplit[i][5].replace(/[$]/g, "")
												),
												'18"x24" Price': parseFloat(
													tableSplit[i][6].replace(/[$]/g, "")
												),
												'24"x32" Price': parseFloat(
													tableSplit[i][7].replace(/[$]/g, "")
												),
											};
											rows.push(row);
										}
										setPostersCSV(rows);
									}
								}
							}}
						/>
						<button
							className="bg-blue-300 rounded px-2 py-1 w-fit"
							onClick={addPosterCSV}
						>
							Submit Poster CSV
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
						onClick={() => {
							handlePasswordSubmit(false);
						}}
					>
						Submit
					</button>
				</div>
			)}
		</div>
	);
}

const fetchInitial = async (
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
