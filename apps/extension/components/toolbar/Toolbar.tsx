import { useTextSelection } from "@/hooks/useTextSelection";

const Toolbar = () => {
	const { clientRect, isCollapsed } = useTextSelection();

	if (isCollapsed || !clientRect) return null;

	const top = clientRect.top + window.scrollY - 50;
	const left = clientRect.left + clientRect.width / 2 + window.scrollX;

	return (
		<button
			type="button"
			style={{
				position: "absolute",
				top: `${top}px`,
				left: `${left}px`,
				transform: "translateX(-50%)",
				background: "black",
				color: "white",
				padding: "8px 12px",
				borderRadius: "8px",
				zIndex: 9999,
				cursor: "pointer",
			}}
			onMouseDown={(e) => e.preventDefault()}
		>
			<span>하이라이트</span>
			<span> | </span>
			<span>메모</span>
		</button>
	);
};

export default Toolbar;
