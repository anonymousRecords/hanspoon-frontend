interface HanspoonFloatingButtonProps {
	handleMouseDown: () => void;
	setIsOpen: (value: boolean) => void;
	isDragging: boolean;
	isOpen: boolean;
	isHover: boolean;
}

export const HanspoonFloatingButton = ({
	handleMouseDown,
	setIsOpen,
	isDragging,
	isOpen,
	isHover,
}: HanspoonFloatingButtonProps) => {
	return (
		<div>
			<button
				type="button"
				style={{
					display: isHover ? "block" : "none",
					border: 'none',
					borderRadius: 180,
				}}
			>
				X
			</button>
			<button
				type="button"
				onMouseDown={handleMouseDown}
				onClick={() => {
					if (!isDragging) {
						setIsOpen(!isOpen);
					}
				}}
				style={{
					width: "60px",
					height: "40px",
					borderTopLeftRadius: "30px",
					borderBottomLeftRadius: "30px",
					backgroundColor: "#4ade80",
					border: "none",
					cursor: isDragging ? "grabbing" : "grab",
					boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
					fontSize: "28px",
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					transition: isDragging ? "none" : "all 0.3s ease",
				}}
			>
				🥄
			</button>
		</div>
	);
};
