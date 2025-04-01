import { parse } from "csv-parse";
import * as fs from "fs";
import { neon } from "@neondatabase/serverless";

interface DataRow {
	ID: string;
	"Product Name": string;
	"Small Price": number | string;
	"Medium Price": number | string;
	"Large Price": number | string;
	"XL Price": number | string;
	"2XL Price": number | string;
	"3XL Price": number | string;
}

async function create(row: DataRow) {
	// Connect to the Neon database
	const sql = neon(`${process.env.DATABASE_URL}`);
	// Insert the comment from the form into the Postgres database
	try {
		await sql`INSERT INTO tshirts (id, productname, smallprice, mediumprice, largeprice, xlprice, doublexlprice, triplexlprice) VALUES (${row.ID}, ${row["Product Name"]}, ${row["Small Price"]}, ${row["Medium Price"]}, ${row["Large Price"]}, ${row["XL Price"]}, ${row["2XL Price"]}, ${row["3XL Price"]})`;
		console.log(`Inserted record with ID: ${row.ID}`);
	} catch (error) {
		console.error(`Error inserting record with ID ${row.ID}:`, error);
	}
}

fs.readFile("Prices - TShirt Table.csv", { encoding: "utf8" }, (err, file) => {
	if (err) {
		console.error("Error reading the file:", err);
		return;
	}
	parse(
		file,
		{
			delimiter: ",",
			columns: true,
			skip_empty_lines: true,
		},
		(err, records: DataRow[]) => {
			if (err) {
				console.error("Error parsing the CSV:", err);
				return;
			}
			// Remove the dollar sign before the prices and convert to double
			const newRecords = records.map((record) => {
				if (
					typeof record["Small Price"] === "string" &&
					typeof record["Medium Price"] === "string" &&
					typeof record["Large Price"] === "string" &&
					typeof record["XL Price"] === "string" &&
					typeof record["2XL Price"] === "string" &&
					typeof record["3XL Price"] === "string"
				) {
					return {
						...record,
						"Small Price":
							parseFloat(record["Small Price"].replace(/[$]/g, "")) || 0,
						"Medium Price":
							parseFloat(record["Medium Price"].replace(/[$]/g, "")) || 0,
						"Large Price":
							parseFloat(record["Large Price"].replace(/[$]/g, "")) || 0,
						"XL Price": parseFloat(record["XL Price"].replace(/[$]/g, "")) || 0,
						"2XL Price":
							parseFloat(record["2XL Price"].replace(/[$]/g, "")) || 0,
						"3XL Price":
							parseFloat(record["3XL Price"].replace(/[$]/g, "")) || 0,
					};
				}
				return record; // Return the record as-is if the condition is not met
			});
			newRecords.forEach((record) => {
				create(record)
					.then(() => {
						console.log(`Inserted record with ID: ${record.ID}`);
					})
					.catch((error) => {
						console.error(
							`Error inserting record with ID ${record.ID}:`,
							error
						);
					});
			});
		}
	);
});
