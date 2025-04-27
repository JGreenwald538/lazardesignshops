"use server"

import bcryptjs from "bcryptjs";

export async function checkPassword(password: string) {
	try {
		const result = await bcryptjs.compare(
			password,
			Buffer.from(process.env.PASSWORD_HASH!, "base64").toString("utf-8")
		);
		return result;
	} catch (error) {
		console.error("Error comparing passwords:", error);
		throw error;
	}
}
