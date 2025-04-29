import { DataRowTshirt } from "@/app/utils/DataRowTshirt";
import { neon } from "@neondatabase/serverless";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
	const DATABASE_URL = process.env.DATABASE_URL;

	if (!DATABASE_URL) {
		return NextResponse.json(
			{ error: "Missing database URL" },
			{ status: 500 }
		);
	}

	const { tshirt }: { tshirt: DataRowTshirt } = await req.json();

	const sql = neon(DATABASE_URL);

	try {
        console.log(tshirt["Product Name"])
		const tshirtResult = await sql`SELECT * FROM tshirts WHERE id = ${tshirt.ID}`;

		if (tshirtResult) {
            console.log(tshirt.ID)
			await sql`UPDATE tshirts 
            SET 
            productname=${tshirt["Product Name"]}, 
            smallprice=${tshirt["Small Price"]},
            mediumprice=${tshirt["Medium Price"]},
            largeprice=${tshirt["Large Price"]},
            doublexlprice=${tshirt["2XL Price"]},
            triplexlprice=${tshirt["3XL Price"]}
            WHERE
            id=${tshirt.ID}`;

			return NextResponse.json(
				{ message: "Tshirt updated successfully" },
				{ status: 200 }
			);
		} else {
			await sql`INSERT INTO tshirts (id, productname, smallprice, mediumprice, largeprice, xlprice, doublexlprice, triplexlprice) 
            VALUES (${tshirt.ID}, 
                ${tshirt["Product Name"]}, 
                ${tshirt["Small Price"]}, 
                ${tshirt["Medium Price"]}, 
                ${tshirt["Large Price"]}, 
                ${tshirt["XL Price"]}, 
                ${tshirt["2XL Price"]}, 
                ${tshirt["3XL Price"]})`;
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
