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

    const { id, description, imagesSource, updated_at }: { id: string, description: string, imagesSource: {src: string}[], updated_at: string } = await req.json();

    const sql = neon(DATABASE_URL);
    const images = imagesSource.map((image) => image.src)

    try {
        await sql`
            UPDATE tshirts 
            SET 
                description = ${description || ''},
                images = ${images},
                updated_at = ${updated_at}
            WHERE id = ${id}
        `;

        console.log(`Updated record with ID: ${id}`);
        return NextResponse.json({ message: "Tshirt updated successfully" }, { status: 200 });

    } catch (error) {
        console.error("Database update failed:", error);
        return NextResponse.json(
            { error: "Failed to update tshirt" },
            { status: 500 }
        );
    }
}
