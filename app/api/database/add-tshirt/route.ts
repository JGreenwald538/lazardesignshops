import { DataRowTshirt } from "@/app/utils/DataRowTshirt";
import { neon } from "@neondatabase/serverless";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
	const DATABASE_URL = process.env.DATABASE_URL;
	const API_KEY = process.env.PRINTIFY_API_KEY;
	const STORE_ID = process.env.PRINTIFY_STORE_ID;

	if (!DATABASE_URL) {
		return NextResponse.json(
			{ error: "Missing database URL" },
			{ status: 500 }
		);
	}

	const { tshirt }: { tshirt: DataRowTshirt } = await req.json();

	const sql = neon(DATABASE_URL);

	const apiUrl = `https://api.printify.com/v1/shops/${STORE_ID}/products/${tshirt.id.trim()}.json`;

	function isSize(string: string) {
		return string === "S" || string === "M" || string === "L" || string === "XL" || string === "2XL" || string === "3XL"
		|| string === "4XL" || string === "5XL";
	}

	try {
		const printifyResult = await fetch(apiUrl, {
			headers: {
				Authorization: `Bearer ${API_KEY}`,
				"Content-Type": "application/json",
			},
		});

		if (!printifyResult) {
			console.error("Not valid ID: " + tshirt.id);
			return NextResponse.json(
				{ error: "Failed to add tshirt" },
				{ status: 500 }
			);
		}

		const printifyProduct = await printifyResult.json() as {variants: {title: string, is_enabled: boolean}[], created_at: string, updated_at: string, images: {src: string}[]}

		const colors:string[] = [];

		const variants = printifyProduct.variants.filter((product)=>product.is_enabled)

		for (const variant in variants) {
			const titleList = variants[variant].title.split("/")
			let color = ""
			if(isSize(titleList[0].trim())) {
				color = titleList[1].trim()
			} else {
				color = titleList[0].trim()
			}
			if(!(colors.indexOf(color) != -1)) {
				colors.push(color)
			}
		}

		const tshirtResult = await sql`SELECT * FROM tshirts WHERE id = ${tshirt.id}`;

		if (tshirtResult.length !== 0) {
			await sql`UPDATE tshirts 
            SET 
            productname=${tshirt["Product Name"]}, 
            smallprice=${tshirt["Small Price"]},
            mediumprice=${tshirt["Medium Price"]},
            largeprice=${tshirt["Large Price"]},
			xlprice=${tshirt["XL Price"]},
            doublexlprice=${tshirt["2XL Price"]},
            triplexlprice=${tshirt["3XL Price"]},
			colors=${colors},
			created_at=${printifyProduct.created_at},
			updated_at=${printifyProduct.updated_at},
			images=${printifyProduct.images.map((image)=>image.src)}
            WHERE
            id=${tshirt.id}`;

			return NextResponse.json(
				{ message: "Tshirt updated successfully" },
				{ status: 200 }
			);
		} else {
			await sql`INSERT INTO tshirts(id, productname, smallprice, mediumprice, largeprice, xlprice, doublexlprice, triplexlprice, colors, created_at, updated_at, images) 
            VALUES (${tshirt.id}, 
                ${tshirt["Product Name"]}, 
                ${tshirt["Small Price"]}, 
                ${tshirt["Medium Price"]}, 
                ${tshirt["Large Price"]}, 
                ${tshirt["XL Price"]}, 
                ${tshirt["2XL Price"]}, 
                ${tshirt["3XL Price"]},
				${colors},
				${printifyProduct.created_at},
				${printifyProduct.updated_at},
				${printifyProduct.images.map((image)=>image.src)})`
				
			return NextResponse.json(
				{ message: "Tshirt added successfully" },
				{ status: 200 }
			);
		}
	} catch (error) {
		console.error("Database addition/update failed:", error);
		return NextResponse.json(
			{ error: "Failed to update tshirt" },
			{ status: 500 }
		);
	}
}
