"use server";

import bcryptjs from "bcryptjs";
import { cookies } from "next/headers";

export async function checkPassword(password: string) {
	const cookieStore = await cookies();
	const passwordCookie = cookieStore.get("password")?.value || "";
	try {
		const result =
			(await bcryptjs.compare(
				password,
				Buffer.from(process.env.PASSWORD_HASH!, "base64").toString("utf-8")
			));
		if (result) {
			cookieStore.set("password", password, {
				secure: true,
				maxAge: 30 * 24 * 60 * 60,
				path: "/admin",
				httpOnly: true,
				sameSite: true,
			});
		}

		const cookieCorrect = (await bcryptjs.compare(
				passwordCookie,
				Buffer.from(process.env.PASSWORD_HASH!, "base64").toString("utf-8")
			));

		return result || cookieCorrect;
	} catch (error) {
		console.error("Error comparing passwords:", error);
		throw error;
	}
}
