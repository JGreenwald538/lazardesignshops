import React from "react";
import Marquee from "react-fast-marquee";

const messages = [
	"$35+ FREE SHIPPING",
];

const TickerComponent = () => {
	return (
		<div className="flex justify-center w-full overflow-hidden text-white py-2 bg-[#206DCC] mt-4">
			<div className="max-w-full w-full">
				<Marquee speed={50} gradient={false} loop={0} autoFill>
					{messages.map((msg, index) => (
						<span
							key={index}
							className="text-lg font-bold mx-10 whitespace-nowrap select-none"
						>
							{msg}
						</span>
					))}
				</Marquee>
			</div>
		</div>
	);
};

export default TickerComponent;
