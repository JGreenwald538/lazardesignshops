"use client";

import React from "react";
// import { Instagram, Mail } from "lucide-react";
import TopBar from "../components/TopBar";
import Image from "next/image";
import Link from "next/link";
import InstagramEmbed from "../components/Instagram";

const ContactPage = () => {
	return (
		<div className="min-h-screen relative overflow-hidden">
			{/* Background SVG Shapes */}
			<div className="absolute inset-0 pointer-events-none">
				{/* Red/Pink shape - top left */}
				<svg
					className="absolute md:top-[181px] top-60"
					width="164"
					height="367"
					viewBox="0 0 164 367"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
				>
					<g filter="url(#filter0_i_128_110)">
						<path
							d="M9.67742 13.5134C33.9612 -11.0836 75.7588 -0.255765 85.0457 33.0379L162.123 309.358C171.44 342.762 141.063 373.708 107.492 365.011L-171.128 292.833C-204.699 284.136 -216.23 242.334 -191.866 217.656L9.67742 13.5134Z"
							fill="#D67070"
						/>
					</g>
					<defs>
						<filter
							id="filter0_i_128_110"
							x="-209.872"
							y="-2.89746"
							width="373.699"
							height="369.393"
							filterUnits="userSpaceOnUse"
							colorInterpolationFilters="sRGB"
						>
							<feFlood floodOpacity="0" result="BackgroundImageFix" />
							<feBlend
								mode="normal"
								in="SourceGraphic"
								in2="BackgroundImageFix"
								result="shape"
							/>
							<feColorMatrix
								in="SourceAlpha"
								type="matrix"
								values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
								result="hardAlpha"
							/>
							<feOffset dx="-5" dy="-3" />
							<feGaussianBlur stdDeviation="3.3" />
							<feComposite
								in2="hardAlpha"
								operator="arithmetic"
								k2="-1"
								k3="1"
							/>
							<feColorMatrix
								type="matrix"
								values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.4 0"
							/>
							<feBlend
								mode="normal"
								in2="shape"
								result="effect1_innerShadow_128_110"
							/>
						</filter>
					</defs>
				</svg>

				{/* Green shape - bottom left */}
				<svg
					className="absolute left-32 bottom-0"
					width="393"
					height="221"
					viewBox="0 0 393 221"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
				>
					<g filter="url(#filter0_i_128_107)">
						<rect
							x="58.1632"
							y="-13"
							width="357.534"
							height="315.843"
							rx="68.222"
							transform="rotate(13.0212 58.1632 -13)"
							fill="#7AC48C"
						/>
					</g>
					<defs>
						<filter
							id="filter0_i_128_107"
							x="-4.39819"
							y="-3.39844"
							width="397.3"
							height="365.075"
							filterUnits="userSpaceOnUse"
							colorInterpolationFilters="sRGB"
						>
							<feFlood floodOpacity="0" result="BackgroundImageFix" />
							<feBlend
								mode="normal"
								in="SourceGraphic"
								in2="BackgroundImageFix"
								result="shape"
							/>
							<feColorMatrix
								in="SourceAlpha"
								type="matrix"
								values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
								result="hardAlpha"
							/>
							<feOffset dx="-5" dy="-4" />
							<feGaussianBlur stdDeviation="3.3" />
							<feComposite
								in2="hardAlpha"
								operator="arithmetic"
								k2="-1"
								k3="1"
							/>
							<feColorMatrix
								type="matrix"
								values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.4 0"
							/>
							<feBlend
								mode="normal"
								in2="shape"
								result="effect1_innerShadow_128_107"
							/>
						</filter>
					</defs>
				</svg>

				{/* Blue shape - right side */}
				<svg
					className="absolute -right-0 md:top-40 top-[600px]"
					width="198"
					height="356"
					viewBox="0 0 198 356"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
				>
					<g filter="url(#filter0_i_128_108)">
						<path
							d="M128.981 37.0537C174.102 -21.3898 265.897 -7.38403 291.537 61.856L353.249 228.511C378.123 295.683 321.731 364.882 250.92 354.078L80.6051 328.091C9.79451 317.287 -23.3958 234.421 20.3781 177.722L128.981 37.0537Z"
							fill="#709BD6"
						/>
					</g>
					<defs>
						<filter
							id="filter0_i_128_108"
							x="0.684814"
							y="-5.5249"
							width="364.54"
							height="360.723"
							filterUnits="userSpaceOnUse"
							colorInterpolationFilters="sRGB"
						>
							<feFlood floodOpacity="0" result="BackgroundImageFix" />
							<feBlend
								mode="normal"
								in="SourceGraphic"
								in2="BackgroundImageFix"
								result="shape"
							/>
							<feColorMatrix
								in="SourceAlpha"
								type="matrix"
								values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
								result="hardAlpha"
							/>
							<feOffset dx="6" dy="-6" />
							<feGaussianBlur stdDeviation="3.5" />
							<feComposite
								in2="hardAlpha"
								operator="arithmetic"
								k2="-1"
								k3="1"
							/>
							<feColorMatrix
								type="matrix"
								values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.4 0"
							/>
							<feBlend
								mode="normal"
								in2="shape"
								result="effect1_innerShadow_128_108"
							/>
						</filter>
					</defs>
				</svg>
			</div>

			{/* Header - Replace with your TopBar component */}
			<TopBar />

			{/* Main Content */}
			<main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
				<div className="flex flex-col lg:flex-row items-center lg:items-start gap-12">
					{/* Left side - Contact Info */}
					<div className="flex-1 text-center lg:text-left mt-16">
						<h1 className="text-5xl lg:text-7xl font-bold text-gray-900 mb-12">
							Contact Us
						</h1>

						<div className="space-y-6">
							<Link
								href="https://www.instagram.com/lazardesigns_/"
								target="_blank"
							>
								<div className="flex items-center justify-center lg:justify-start gap-4">
									<svg
										width="40"
										height="40"
										viewBox="0 0 51 51"
										fill="none"
										xmlns="http://www.w3.org/2000/svg"
									>
										<path
											d="M14.772 0.359157C12.0891 0.485651 10.257 0.913884 8.65524 1.543C6.99777 2.18913 5.59266 3.05589 4.1947 4.45889C2.79694 5.86188 1.93585 7.26782 1.29455 8.92822C0.673834 10.5331 0.253163 12.3669 0.134652 15.0512C0.016141 17.7356 -0.0101247 18.5986 0.0031132 25.4461C0.016141 32.2932 0.0463991 33.1515 0.176467 35.8415C0.304643 38.5238 0.731198 40.3554 1.36052 41.9576C2.00771 43.6153 2.87343 45.0198 4.27707 46.4181C5.6805 47.8165 7.0854 48.6755 8.74959 49.3178C10.3533 49.9377 12.1875 50.3603 14.8714 50.4777C17.5553 50.5954 18.4192 50.6227 25.2646 50.6095C32.1101 50.5964 32.972 50.566 35.6612 50.4384C38.3508 50.3109 40.1726 49.8812 41.7755 49.2548C43.4331 48.6064 44.8387 47.7419 46.236 46.3381C47.6333 44.934 48.4938 43.527 49.1347 41.8658C49.756 40.2621 50.1782 38.4282 50.2946 35.7461C50.4122 33.0547 50.44 32.1955 50.427 25.3492C50.4137 18.5027 50.3828 17.6444 50.2553 14.9554C50.1277 12.2665 49.7006 10.4405 49.0716 8.83724C48.4236 7.17957 47.5587 5.77615 46.1559 4.37673C44.7529 2.9773 43.3447 2.11747 41.6843 1.47807C40.0793 0.857151 38.2464 0.434171 35.5625 0.318182C32.8785 0.202194 32.0147 0.172146 25.1667 0.185594C18.3187 0.198622 17.4614 0.228039 14.772 0.359157ZM15.0666 45.9416C12.6081 45.8346 11.2732 45.4261 10.3835 45.0843C9.20556 44.6304 8.36632 44.0818 7.4798 43.2037C6.59307 42.3258 6.04864 41.4836 5.58867 40.3081C5.24323 39.4185 4.82718 38.085 4.71224 35.6266C4.58721 32.9696 4.56095 32.1717 4.54624 25.4398C4.53153 18.708 4.55738 17.911 4.67379 15.253C4.77885 12.7966 5.18985 11.4602 5.5311 10.571C5.98497 9.39155 6.53172 8.55378 7.41172 7.6679C8.29173 6.78181 9.13139 6.23611 10.3079 5.77615C11.1967 5.42924 12.53 5.01676 14.9874 4.89973C17.6465 4.77365 18.4433 4.74844 25.1743 4.73373C31.9052 4.71902 32.7041 4.74423 35.3643 4.86148C37.8207 4.96823 39.1577 5.37524 40.0459 5.71879C41.2243 6.17266 42.0631 6.71772 42.949 7.5994C43.8351 8.48066 44.3812 9.31737 44.8412 10.4964C45.1885 11.3825 45.6012 12.7153 45.7172 15.1744C45.8437 17.8335 45.8725 18.6309 45.8845 25.3612C45.8966 32.0915 45.8729 32.8908 45.7563 35.548C45.6491 38.0064 45.2415 39.3418 44.899 40.2325C44.4451 41.41 43.8981 42.2497 43.0175 43.1351C42.1371 44.0208 41.2985 44.5663 40.1213 45.0263C39.2338 45.3728 37.8988 45.7863 35.4435 45.9033C32.7842 46.0283 31.9874 46.0546 25.2539 46.0693C18.5204 46.084 17.7257 46.0567 15.0666 45.9416ZM35.6226 11.921C35.6236 12.5195 35.802 13.1043 36.1354 13.6013C36.4688 14.0984 36.942 14.4854 37.4954 14.7135C38.0487 14.9415 38.6573 15.0004 39.2441 14.8825C39.8309 14.7647 40.3695 14.4755 40.7919 14.0515C41.2143 13.6275 41.5015 13.0878 41.6172 12.5006C41.7328 11.9133 41.6717 11.305 41.4415 10.7525C41.2114 10.2 40.8226 9.72821 40.3243 9.39671C39.826 9.06522 39.2406 8.88894 38.6421 8.89019C37.8398 8.89186 37.071 9.21208 36.5048 9.78043C35.9385 10.3488 35.6212 11.1187 35.6226 11.921ZM12.2681 25.4227C12.2822 32.5737 18.0899 38.3573 25.2392 38.3439C32.3889 38.3302 38.1766 32.5233 38.1632 25.3723C38.1495 18.2214 32.3406 12.436 25.19 12.4501C18.0395 12.4642 12.2547 18.2726 12.2681 25.4227ZM16.81 25.4137C16.8067 23.7514 17.2965 22.1254 18.2173 20.7414C19.1381 19.3574 20.4486 18.2775 21.9832 17.6383C23.5177 16.9992 25.2074 16.8294 26.8384 17.1504C28.4694 17.4715 29.9687 18.269 31.1464 19.4421C32.3242 20.6152 33.1277 22.1112 33.4553 23.741C33.7828 25.3707 33.6197 27.061 32.9866 28.5981C32.3536 30.1351 31.2789 31.4499 29.8986 32.3763C28.5182 33.3026 26.8942 33.7987 25.2318 33.8021C24.128 33.8044 23.0346 33.5892 22.0139 33.1689C20.9933 32.7486 20.0654 32.1313 19.2833 31.3524C18.5013 30.5734 17.8803 29.648 17.4559 28.6291C17.0316 27.6101 16.8121 26.5175 16.81 25.4137Z"
											fill="#292929"
										/>
									</svg>
									<span className="md:text-3xl text-2xl text-gray-800">
										@lazardesigns_
									</span>
								</div>
							</Link>

							<div className="flex items-center justify-center lg:justify-start gap-4">
								<svg
									width="40"
									height="45"
									viewBox="0 0 57 45"
									fill="none"
									xmlns="http://www.w3.org/2000/svg"
								>
									<path
										d="M46.0697 7.26953L28.6273 18.1699L11.1859 7.26953H46.0697Z"
										fill="#292929"
										stroke="#292929"
										stroke-width="2.78762"
									/>
									<path
										d="M6.32656 3.08887H50.9284C52.4616 3.08887 53.7161 4.3433 53.7161 5.87649V39.3279C53.7161 40.8611 52.4616 42.1155 50.9284 42.1155H6.32656C4.79337 42.1155 3.53894 40.8611 3.53894 39.3279V5.87649C3.53894 4.3433 4.79337 3.08887 6.32656 3.08887Z"
										stroke="#292929"
										stroke-width="5.57524"
										stroke-linecap="round"
										stroke-linejoin="round"
									/>
									<path
										d="M3.53894 7.26953L28.6275 22.6014L53.7161 7.26953"
										stroke="#292929"
										stroke-width="5.57524"
										stroke-linecap="round"
										stroke-linejoin="round"
									/>
								</svg>
								<button
									className="flex flex-row items-center"
									onClick={() => {
										navigator.clipboard.writeText("lazardesigns11@gmail.com");
										alert("Email copied");
									}}
								>
									<span className="md:text-3xl text-2xl text-gray-800">
										lazardesigns11@gmail.com
									</span>
								</button>
							</div>
						</div>
					</div>

					{/* Right side - Phone Mockup */}
					<div className="flex-1 flex justify-center">
						<div className="relative">
							{/* Phone Frame */}
							<InstagramEmbed />
						</div>
					</div>
				</div>
			</main>
		</div>
	);
};

export default ContactPage;
