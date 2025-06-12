"use client";

import { useState } from "react";
import TopBar from "../components/TopBar";

export default function CustomOrderPage() {
	const [formData, setFormData] = useState({
		name: "",
		email: "",
		message: "",
		file: null as File | null,
		typeOfProject: "",
	});
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [response, setResponse] = useState<string | null>(null);
	const [isOtherProjectType, setIsOtherProjectType] = useState(false);
	const [otherProjectType, setOtherProjectType] = useState("");

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsSubmitting(true);
		setResponse(null);

		try {
			let base64File = null;

			if (formData.file) {
				base64File = await fileToBase64(formData.file);
			}

			console.log({
				...formData,
				typeOfProject: isOtherProjectType
					? otherProjectType
					: formData.typeOfProject,
				file: base64File, // base64 string here
			});

			const res = await fetch("/api/custom-order/send", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					...formData,
					typeOfProject: isOtherProjectType
						? otherProjectType
						: formData.typeOfProject,
					file: base64File, // base64 string here
				}),
			});

			const data = await res.json();
			setResponse(data.message);
		} catch (error) {
			console.error("Error submitting form:", error);
			setResponse("Something went wrong. Please try again.");
		} finally {
			setIsSubmitting(false);
		}
	};

	const fileToBase64 = (file: File): Promise<string> => {
		return new Promise((resolve, reject) => {
			const reader = new FileReader();
			reader.readAsDataURL(file);
			reader.onload = () => resolve(reader.result as string);
			reader.onerror = reject;
		});
	};

	return (
		<div className="">
			<TopBar />
			<div className="h-full flex items-center justify-center">
				<form
					onSubmit={handleSubmit}
					className="space-y-4 max-w-md mx-auto p-4 border rounded shadow flex-1"
				>
					<h2 className="text-xl font-semibold">Custom Order Form</h2>
					<p className="text-xs text-black/70 mb-4">
						Alternatively, you can send your project ideas to our{" "}
						<a
							href="https://www.instagram.com/lazardesigns_/"
							className="text-blue-500 hover:underline"
						>
							Instagram
						</a>
					</p>
					<input
						type="text"
						name="name"
						required
						placeholder="Your Name"
						value={formData.name}
						onChange={handleChange}
						className="w-full p-2 border rounded"
					/>
					<input
						type="email"
						name="email"
						required
						placeholder="Your Email"
						value={formData.email}
						onChange={handleChange}
						className="w-full p-2 border rounded"
					/>
					<h2>Project Details</h2>
					<select
						name="typeOfProject"
						value={formData.typeOfProject}
						onChange={(e) => {
							setIsOtherProjectType(e.target.value === "Other");
							setFormData((prev) => ({
								...prev,
								typeOfProject: e.target.value,
							}));
							if (e.target.value !== "Other") {
								setOtherProjectType(""); // Reset other project type if not "Other"
							}
						}}
						className={`w-full p-2 border rounded ${formData.typeOfProject === "" ? "text-gray-400" : ""}`}
					>
						<option value="" disabled className="text-gray-500">
							Type of Project
						</option>
						<option value="Poster">Poster</option>
						<option value="Album Cover">Album Cover</option>
						<option value="Logo/Branding">Logo/Branding</option>
						<option value="Other">Other</option>
					</select>
					{isOtherProjectType && (
						<input
							type="text"
							name="otherProjectType"
							placeholder="Specify other project type"
							value={otherProjectType}
							onChange={(e) => {
								setOtherProjectType(e.target.value);
							}}
							className="w-full p-2 border rounded"
						/>
					)}
					<h2>Please add all the details/ideas of your project here </h2>
					<textarea
						name="message"
						required
						placeholder="Your Message"
						value={formData.message}
						onChange={handleChange}
						rows={5}
						className="w-full p-2 border rounded"
					/>
					<input
						type="file"
						name="file"
						accept="image/*"
						className="w-full p-2 rounded"
						onChange={(e) => {
							const files = e.target.files;
							if (files && files[0]) {
								setFormData((prev) => ({
									...prev,
									file: files[0],
								}));
							}
						}}
					/>
					<button
						type="submit"
						disabled={isSubmitting}
						className="w-full bg-[#206DCC] text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
					>
						{isSubmitting ? "Sending..." : "Send Message"}
					</button>
					{response && <p className="text-sm mt-2">{response}</p>}
				</form>
			</div>
		</div>
	);
}
