import printifyColors from "@/app/utils/PrintifyColors";
import { neon } from "@neondatabase/serverless";
import { NextResponse } from "next/server";

const normalizeHex = (value: string): string | null => {
    const trimmed = value.trim();
    const withHash = trimmed.startsWith("#") ? trimmed : `#${trimmed}`;
    const normalized = withHash.toUpperCase();

    if (!/^#[0-9A-F]{6}$/.test(normalized)) {
        return null;
    }

    return normalized;
};

export async function POST(req: Request) {
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

        let body: unknown = null;
        try {
            body = await req.json();
        } catch {
            // If body is missing, we run the full color-map upload behavior.
        }

        if (
            body &&
            typeof body === "object" &&
            "name" in body &&
            "hex" in body
        ) {
            const rawName = String(body.name ?? "").trim();
            const rawHex = String(body.hex ?? "").trim();

            if (!rawName || !rawHex) {
                return NextResponse.json(
                    { error: "Color name and hex are required" },
                    { status: 400 }
                );
            }

            const normalizedHex = normalizeHex(rawHex);

            if (!normalizedHex) {
                return NextResponse.json(
                    { error: "Hex must be a valid 6-digit value" },
                    { status: 400 }
                );
            }

            await sql`
				INSERT INTO colors (name, hex)
				VALUES (${rawName}, ${normalizedHex})
				ON CONFLICT (name)
				DO UPDATE SET
					hex = EXCLUDED.hex,
					updated_at = NOW()
			`;

            return NextResponse.json(
                {
                    message: "Color saved successfully",
                    name: rawName,
                    hex: normalizedHex,
                },
                { status: 200 }
            );
        }

        let upserted = 0;
        const invalid: { name: string; hex: string }[] = [];

        for (const [name, rawHex] of Object.entries(printifyColors)) {
            const normalizedHex = normalizeHex(rawHex);

            if (!normalizedHex) {
                invalid.push({ name, hex: rawHex });
                continue;
            }

            await sql`
				INSERT INTO colors (name, hex)
				VALUES (${name}, ${normalizedHex})
				ON CONFLICT (name)
				DO UPDATE SET
					hex = EXCLUDED.hex,
					updated_at = NOW()
			`;
            upserted += 1;
        }

        return NextResponse.json(
            {
                message: "Colors uploaded successfully",
                upserted,
                total: Object.keys(printifyColors).length,
                invalid,
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("Color upload failed:", error);
        return NextResponse.json(
            { error: "Failed to upload colors" },
            { status: 500 }
        );
    }
}