"use client";

import Marquee from "react-fast-marquee";

const message = "$35+ FREE STANDARD SHIPPING";

const TickerComponent = () => {
	return (
		<div className="mt-4 w-full overflow-hidden border-y border-[#141110]/10 bg-[#141110] py-3 text-white shadow-[0_18px_40px_rgba(20,17,16,0.12)]">
			<Marquee autoFill gradient={false} pauseOnHover speed={100}>
				<span className="mr-10 shrink-0 select-none whitespace-nowrap text-sm font-semibold uppercase tracking-[0.32em] text-white/90 sm:tracking-[0.35em]">
					{message}
				</span>
			</Marquee>
		</div>
	);
};

export default TickerComponent;
