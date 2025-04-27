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

    const { id, description, images }: { id: string, description: string, images: string[] } = await req.json();

    const sql = neon(DATABASE_URL);

    try {
        const response = await sql`
            UPDATE posters 
            SET 
                description = ${description || ''},
                images = ${images}
            WHERE id = ${id}
        `;

        console.log(`Updated record with ID: ${id}`);
        return NextResponse.json({ message: "Poster updated successfully" }, { status: 200 });

    } catch (error) {
        console.error("Database update failed:", error);
        return NextResponse.json(
            { error: "Failed to update poster" },
            { status: 500 }
        );
    }
}
