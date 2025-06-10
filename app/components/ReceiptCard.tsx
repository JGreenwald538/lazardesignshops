import {
	Html,
	Head,
	Body,
	Container,
	Section,
	Text,
} from "@react-email/components";

type ReceiptItem = {
	item: string;
	tracking: string;
};

type ReceiptEmailProps = {
	receiptNumber: string;
	amountPaid: string;
	datePaid: string;
	paymentMethod: string;
	items: ReceiptItem[];
};

export default function ReceiptEmail({
	receiptNumber,
	amountPaid,
	datePaid,
	paymentMethod,
	items,
}: ReceiptEmailProps) {
	return (
		<Html>
			<Head />
			<Body
				style={{
					fontFamily: "sans-serif",
					backgroundColor: "#f3f3f3",
					padding: "20px",
				}}
			>
				<Container
					style={{
						backgroundColor: "#ffffff",
						borderRadius: "6px",
						padding: "20px",
						maxWidth: "480px",
						margin: "0 auto",
					}}
				>
					{/* Red banner substitute */}
					<Section
						style={{
							backgroundColor: "#e3342f",
							height: "40px",
							borderRadius: "6px 6px 0 0",
						}}
					/>

					<Section style={{ padding: "20px 0" }}>
						<Text
							style={{
								fontSize: "18px",
								fontWeight: "bold",
								textAlign: "center",
								marginBottom: "4px",
							}}
						>
							Receipt from LazarDesigns
						</Text>
						<Text
							style={{ fontSize: "14px", textAlign: "center", color: "#555" }}
						>
							Receipt #{receiptNumber}
						</Text>
					</Section>

					<Section
						style={{
							display: "flex",
							justifyContent: "space-between",
							textAlign: "center",
							marginBottom: "20px",
						}}
					>
						<div>
							<Text
								style={{ fontSize: "12px", fontWeight: "bold", color: "#666" }}
							>
								AMOUNT PAID
							</Text>
							<Text style={{ fontSize: "14px" }}>${amountPaid}</Text>
						</div>
						<div>
							<Text
								style={{ fontSize: "12px", fontWeight: "bold", color: "#666" }}
							>
								DATE PAID
							</Text>
							<Text style={{ fontSize: "14px" }}>{datePaid}</Text>
						</div>
						<div>
							<Text
								style={{ fontSize: "12px", fontWeight: "bold", color: "#666" }}
							>
								PAYMENT METHOD
							</Text>
							<Text style={{ fontSize: "14px" }}>{paymentMethod}</Text>
						</div>
					</Section>

					<Section
						style={{
							backgroundColor: "#f9f9f9",
							borderRadius: "12px",
							padding: "16px",
						}}
					>
						<Text
							style={{
								fontSize: "14px",
								fontWeight: "bold",
								display: "flex",
								justifyContent: "space-between",
								marginBottom: "8px",
							}}
						>
							<span>Item</span>
							<span>Tracking Number</span>
						</Text>

						{items.map((item, idx) => (
							<Text
								key={idx}
								style={{
									fontSize: "14px",
									borderTop: idx > 0 ? "1px solid #ddd" : "none",
									padding: "6px 0",
									display: "flex",
									justifyContent: "space-between",
								}}
							>
								<span>{item.item}</span>
								<span>{item.tracking}</span>
							</Text>
						))}
					</Section>
				</Container>
			</Body>
		</Html>
	);
}
