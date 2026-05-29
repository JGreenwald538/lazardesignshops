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

	const inputClass =
		"w-full rounded-2xl border border-[#141110]/10 bg-white/70 px-4 py-3 text-sm text-[#141110] shadow-sm transition placeholder:text-[#6a625d]/70 focus:border-[#d15b43]/50 focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#d15b43]/15";

	const projectTypes = ["Poster", "Album Cover", "Logo/Branding", "Other"];

	const selectProjectType = (value: string) => {
		setIsOtherProjectType(value === "Other");
		setFormData((prev) => ({ ...prev, typeOfProject: value }));
		if (value !== "Other") {
			setOtherProjectType("");
		}
	};

	return (
		<div className="min-h-screen pb-20">
			<TopBar />
			<div className="mx-auto w-full max-w-3xl px-4 pt-8 sm:px-6 sm:pt-10 lg:px-8">
				{/* Hero */}
				<div className="mb-8 text-center">
					<span className="inline-flex items-center gap-2 rounded-full border border-[#141110]/10 bg-white/70 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.24em] text-[#d15b43] shadow-sm sm:text-xs sm:tracking-[0.3em]">
						✶ Made just for you
					</span>
					<h1 className="mt-5 text-4xl font-black leading-tight tracking-tight text-[#141110] sm:text-5xl">
						Let&apos;s make something
						<span className="relative inline-block text-[#d15b43] sm:ml-2">
							one&#8209;of&#8209;a&#8209;kind
							<span className="absolute -bottom-1 left-0 h-1 w-full rounded-full bg-[#d15b43]/30" />
						</span>
					</h1>
					<p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-[#6a625d] sm:text-base">
						Posters, album covers, logos — whatever you&apos;re dreaming up,
						we&apos;ll design it from scratch. Tell us about your project below
						and we&apos;ll get back to you fast.
					</p>
				</div>

				{/* Form */}
				<form
					onSubmit={handleSubmit}
					className="glass-panel space-y-7 rounded-3xl p-5 sm:rounded-[2rem] sm:p-9"
				>
					{/* Contact */}
					<div className="space-y-4">
						<div className="flex items-center gap-3">
							<span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#141110] text-xs font-bold text-white">
								1
							</span>
							<h2 className="text-lg font-bold tracking-tight text-[#141110]">
								Your details
							</h2>
						</div>
						<div className="grid gap-4 sm:grid-cols-2">
							<input
								type="text"
								name="name"
								required
								placeholder="Your Name"
								value={formData.name}
								onChange={handleChange}
								className={inputClass}
							/>
							<input
								type="email"
								name="email"
								required
								placeholder="Your Email"
								value={formData.email}
								onChange={handleChange}
								className={inputClass}
							/>
						</div>
					</div>

					{/* Project type */}
					<div className="space-y-4">
						<div className="flex items-center gap-3">
							<span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#141110] text-xs font-bold text-white">
								2
							</span>
							<h2 className="text-lg font-bold tracking-tight text-[#141110]">
								What are we making?
							</h2>
						</div>
						<div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
							{projectTypes.map((type) => {
								const active = formData.typeOfProject === type;
								return (
									<button
										key={type}
										type="button"
										onClick={() => selectProjectType(type)}
										className={`store-button min-h-14 rounded-2xl border px-3 py-3 text-sm font-semibold leading-tight shadow-sm sm:py-4 ${
											active
												? "border-[#d15b43] bg-[#d15b43] text-white shadow-[#d15b43]/25"
												: "border-[#141110]/10 bg-white/70 text-[#141110] hover:border-[#d15b43]/35 hover:bg-white"
										}`}
									>
										{type}
									</button>
								);
							})}
						</div>
						{isOtherProjectType && (
							<input
								type="text"
								name="otherProjectType"
								placeholder="Tell us what kind of project"
								value={otherProjectType}
								onChange={(e) => {
									setOtherProjectType(e.target.value);
								}}
								className={inputClass}
							/>
						)}
					</div>

					{/* Details */}
					<div className="space-y-4">
						<div className="flex items-center gap-3">
							<span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#141110] text-xs font-bold text-white">
								3
							</span>
							<h2 className="text-lg font-bold tracking-tight text-[#141110]">
								The vision
							</h2>
						</div>
						<textarea
							name="message"
							required
							placeholder="Share all the details and ideas for your project — colors, vibe, references, deadlines, anything."
							value={formData.message}
							onChange={handleChange}
							rows={5}
							className={`${inputClass} resize-none`}
						/>
						<label className="group flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-[#141110]/20 bg-white/40 px-4 py-7 text-center transition hover:border-[#d15b43]/50 hover:bg-white/70">
							<span className="text-2xl">+</span>
							<span className="text-sm font-semibold text-[#141110]">
								{formData.file
									? formData.file.name
									: "Add a reference image (optional)"}
							</span>
							<span className="text-xs text-[#6a625d]">
								Click to upload — PNG, JPG, etc.
							</span>
							<input
								type="file"
								name="file"
								accept="image/*"
								className="hidden"
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
						</label>
					</div>

					{/* Submit */}
					<div className="space-y-3 pt-1">
						<button
							type="submit"
							disabled={isSubmitting}
							className="store-button w-full rounded-2xl bg-[#141110] px-4 py-4 text-base font-bold text-white shadow-lg shadow-[#141110]/20 hover:bg-[#d15b43] disabled:cursor-not-allowed disabled:opacity-50"
						>
							{isSubmitting ? "Sending…" : "Send my custom request →"}
						</button>
						{response && (
							<p className="rounded-2xl bg-[#d15b43]/10 px-4 py-3 text-center text-sm font-medium text-[#141110]">
								{response}
							</p>
						)}
						<p className="text-center text-xs text-[#6a625d]">
							Prefer DMs? Send your ideas to our{" "}
							<a
								href="https://www.instagram.com/lazardesigns_/"
								className="font-semibold text-[#d15b43] underline-offset-2 hover:underline"
							>
								Instagram
							</a>
							.
						</p>
					</div>
				</form>
			</div>
		</div>
	);
}
