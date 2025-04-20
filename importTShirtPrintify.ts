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
  description?: string;
  images?: string[];
}

interface PrintifyProduct {
  id: string;
  title: string;
  description: string;
  images: { src: string }[];
  // other Printify fields as needed
}

async function updatePoster(row: DataRow) {
  // Connect to the Neon database
  const sql = neon(`${process.env.DATABASE_URL}`);
  
  // Update the poster record in the Postgres database
  try {
    await sql`
      UPDATE tshirts 
      SET 
        description = ${row.description || ''},
        images = ${row.images || []}
      WHERE id = ${row.ID}
    `;
    console.log(`Updated record with ID: ${row.ID}`);
  } catch (error) {
    console.error(`Error updating record with ID ${row.ID}:`, error);
  }
}

async function fetchPrintifyProduct(productId: string): Promise<PrintifyProduct | null> {
  try {
    const API_KEY = process.env.PRINTIFY_API_KEY;
    const STORE_ID = process.env.PRINTIFY_STORE_ID;

    // Fetch the product data from Printify API
    const response = await fetch(
      `https://api.printify.com/v1/shops/${STORE_ID}/products/${productId}.json`,
      {
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`API returned status ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Error fetching Printify product ${productId}:`, error);
    return null;
  }
}

async function processCSV() {
  try {
    const fileContent = await fs.promises.readFile("Prices - TShirt Table.csv", { encoding: "utf8" });
    
    // Parse the CSV file
    const records: DataRow[] = await new Promise((resolve, reject) => {
      parse(
        fileContent,
        {
          delimiter: ",",
          columns: true,
          skip_empty_lines: true,
        },
        (err, result) => {
          if (err) reject(err);
          else resolve(result);
        }
      );
    });

    // Process each record sequentially
    for (const record of records) {
      try {
        // Fetch product details from Printify
        const printifyData = await fetchPrintifyProduct(record.ID);
        
        if (!printifyData) {
          console.warn(`No Printify data found for ID: ${record.ID}, continuing with CSV data only`);
        } else {
          // Merge Printify data with CSV data
          record.description = printifyData.description;
          const newPrintifyImages = printifyData.images.map(image => (image.src));

          record.images = newPrintifyImages;
        }

        // Update the database with the combined data
        await updatePoster(record);
        console.log(`Processed record with ID: ${record.ID}`);
      } catch (recordError) {
        console.error(`Error processing record with ID ${record.ID}:`, recordError);
      }
    }
    
    console.log("All records processed");
  } catch (error) {
    console.error("Error in processCSV:", error);
  }
}

// Run the main process
processCSV().catch(error => {
  console.error("Fatal error:", error);
  process.exit(1);
});