import { neon } from "@neondatabase/serverless";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const DATABASE_URL = process.env.DATABASE_URL;

        if (!DATABASE_URL) {
            return NextResponse.json(
                { error: "Missing database URL" },
                { status: 500 }
            );
        }

        const sql = neon(DATABASE_URL);
        await sql`
			CREATE TABLE IF NOT EXISTS colors (
				id SERIAL PRIMARY KEY,
				name TEXT UNIQUE NOT NULL,
				hex TEXT NOT NULL,
				created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
				updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
			)
		`;
        const colorResults = await sql`
			SELECT name, hex
			FROM colors
			ORDER BY name ASC
		`;

        return NextResponse.json(colorResults, { status: 200 });
    } catch (error) {
        console.error("Error fetching colors:", error);
        return NextResponse.json(
            { error: (error as Error).message },
            { status: 500 }
        );
    }
}