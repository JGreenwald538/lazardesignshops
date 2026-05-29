import type { Metadata, Viewport } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import { Suspense } from "react";

// const geistSans = Geist({
// 	variable: "--font-geist-sans",
// 	subsets: ["latin"],
// });

// const geistMono = Geist_Mono({
// 	variable: "--font-geist-mono",
// 	subsets: ["latin"],
// });

const montserrat = Montserrat({
	variable: "--font-montserrat",
	subsets: ["latin"],
	weight: ["500"],
});

export const metadata: Metadata = {
	title: "LazarDesigns",
	description:
		"Curated posters, graphic tees, and custom design pieces built to stand out.",
	openGraph: {
		type: "website",
		url: "https://lazardesignshops.vercel.app/",
		title: "LazarDesigns",
		description:
			"Curated posters, graphic tees, and custom design pieces built to stand out.",
		images: [
			{
				url: "/LazarDesign.banner.png",
				width: 1200,
				height: 630,
				alt: "LazarDesigns Banner",
			},
		],
	},
	twitter: {
		card: "summary_large_image",
		title: "LazarDesigns",
		description:
			"Curated posters, graphic tees, and custom design pieces built to stand out.",
		images: ["/LazarDesign.banner.png"],
	},
};

export const viewport: Viewport = {
	themeColor: "#14459E",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body
				className={`${montserrat.variable} antialiased bg-[#FCF5EE] text-[#141110]`}
			>
				<Suspense>{children}</Suspense>
			</body>
		</html>
	);
}
