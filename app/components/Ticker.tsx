import React from "react";

const messages = Array.from(
	{ length: 8 },
	() => "$35+ FREE STANDARD SHIPPING",
);

const TickerComponent = () => {
	return (
		<div className="mt-4 flex w-full justify-center overflow-hidden border-y border-[#141110]/10 bg-[#141110] py-3 text-white shadow-[0_18px_40px_rgba(20,17,16,0.12)]">
			<div className="free-shipping-ticker flex w-max items-center">
				{[0, 1].map((groupIndex) => (
					<div
						key={groupIndex}
						className="flex shrink-0 items-center gap-10 pr-10"
						aria-hidden={groupIndex === 1}
					>
						{messages.map((msg, index) => (
							<span
								key={`${groupIndex}-${index}`}
								className="shrink-0 select-none whitespace-nowrap text-sm font-semibold uppercase tracking-[0.32em] text-white/90 sm:tracking-[0.35em]"
							>
								{msg}
							</span>
						))}
					</div>
				))}
			</div>
		</div>
	);
};

export default TickerComponent;
