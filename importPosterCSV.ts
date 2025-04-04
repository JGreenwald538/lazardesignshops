import { parse } from "csv-parse";
import * as fs from "fs";
import { neon } from "@neondatabase/serverless";

interface DataRow {
	ID: string;
	"Product Name": string;
	'11"x14" Price': number | string;
	'12"x16" Price': number | string;
	'16"x20" Price': number | string;
	'20"x24" Price': number | string;
	'18"x24" Price': number | string;
	'24"x32" Price': number | string;
}

async function create(row: DataRow) {
	// Connect to the Neon database
	const sql = neon(`${process.env.DATABASE_URL}`);
	// Insert the comment from the form into the Postgres database
	try {
		await sql`INSERT INTO posters (id, productname, price11by14, price12by16, price16by20, price20by24, price18by24, price24by32) VALUES (${row.ID}, ${row["Product Name"]}, ${row['11"x14" Price']}, ${row['12"x16" Price']}, ${row['16"x20" Price']}, ${row['20"x24" Price']}, ${row['18"x24" Price']}, ${row['24"x32" Price']})`;
		console.log(`Inserted record with ID: ${row.ID}`);
	} catch (error) {
		console.error(`Error inserting record with ID ${row.ID}:`, error);
	}
}

fs.readFile("Prices - Poster Table.csv", { encoding: "utf8" }, (err, file) => {
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
					typeof record['11"x14" Price'] === "string" &&
					typeof record['12"x16" Price'] === "string" &&
					typeof record['16"x20" Price'] === "string" &&
					typeof record['20"x24" Price'] === "string" &&
					typeof record['18"x24" Price'] === "string" &&
					typeof record['24"x32" Price'] === "string"
				) {
					return {
						...record,
						'11"x14" Price':
							parseFloat(record['11"x14" Price'].replace(/[$]/g, "")) || 0,
						'12"x16" Price':
							parseFloat(record['12"x16" Price'].replace(/[$]/g, "")) || 0,
						'16"x20" Price':
							parseFloat(record['16"x20" Price'].replace(/[$]/g, "")) || 0,
						'20"x24" Price': parseFloat(record['20"x24" Price'].replace(/[$]/g, "")) || 0,
						'18"x24" Price':
							parseFloat(record['18"x24" Price'].replace(/[$]/g, "")) || 0,
						'24"x32" Price':
							parseFloat(record['24"x32" Price'].replace(/[$]/g, "")) || 0,
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
