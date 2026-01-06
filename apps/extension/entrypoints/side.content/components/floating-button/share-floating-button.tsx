interface ShareFloatingButtonInterface {
	isHovered: boolean;
	isOpen: boolean;
	setIsOpen: (value: boolean) => void;
	hasMoved: boolean;
}

export const ShareFloatingButton = ({
	isHovered,
	isOpen,
	setIsOpen,
	hasMoved,
}: ShareFloatingButtonInterface) => {
	return (
		<button
			type="button"
			onClick={() => {
				if (!hasMoved) {
					setIsOpen(!isOpen);
				}
			}}
			style={{
				width: "48px",
				height: "48px",
				borderRadius: "50%",
				backgroundColor: "white",
				border: "none",
				cursor: "pointer",
				boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
				fontSize: "20px",
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
				opacity: isHovered ? 1 : 0,
				transform: isHovered ? "translateY(0)" : "translateY(20px)",
				transition: "all 0.3s ease",
				pointerEvents: isHovered ? "auto" : "none",
			}}
		>
			🔗
		</button>
	);
};
