import React from "react";

const messages = Array.from({ length: 8 }, () => "$35 FREE SHIPPING");

const TickerComponent = () => {
	return (
		<div className="mt-4 flex w-full justify-center overflow-hidden border-y border-[#141110]/10 bg-[#141110] py-3 text-white shadow-[0_18px_40px_rgba(20,17,16,0.12)]">
			<div className="flex w-full items-center justify-start gap-10 overflow-hidden pl-4">
				{messages.map((msg, index) => (
					<span
						key={index}
						className="shrink-0 select-none whitespace-nowrap text-sm font-semibold uppercase tracking-[0.32em] text-white/90 sm:tracking-[0.35em]"
					>
						{msg}
					</span>
				))}
			</div>
		</div>
	);
};

export default TickerComponent;
