import { HanspoonFloatingButton } from "./floating-button/haspoon-floating-button";
import { LibraryFloatingButton } from "./floating-button/library-floating-button";
import { SidePanel } from "./side-panel/SidePanel";

const TOP_GAP = 30;
const BOTTOM_GAP = 200;
const DRAG_THRESHOLD = 5;

export const FloatingTab = () => {
	const [isOpen, setIsOpen] = useState(false);
	const [sideWidth] = useState(400);

	const [isHovered, setIsHovered] = useState(false);
	const [isDragging, setIsDragging] = useState(false);
	const [hasMoved, setHasMoved] = useState(false);

	const [yRatio, setYRatio] = useState(0.5);
	const startYRef = useRef(0);
	const startPositionRatioRef = useRef(0);

	const handleMouseDown = (e: React.MouseEvent) => {
		startYRef.current = e.clientY;
		startPositionRatioRef.current = yRatio;
		setIsDragging(true);
	};

	useEffect(() => {
		if (!isDragging) return;

		const handleMouseMove = (e: MouseEvent) => {
			const initialY = startPositionRatioRef.current * window.innerHeight;
			const deltaY = e.clientY - startYRef.current;

			const newY = Math.max(
				TOP_GAP,
				Math.min(window.innerHeight - BOTTOM_GAP, initialY + deltaY),
			);

			const newYRatio = newY / window.innerHeight;

			setYRatio(newYRatio);

			if (!hasMoved && Math.abs(e.clientY - startYRef.current) > DRAG_THRESHOLD) {
				setHasMoved(true);
			}
		};

		const handleMouseUp = () => {
			setIsDragging(false);
			setTimeout(() => setHasMoved(false), 100);
		};

		document.addEventListener("mousemove", handleMouseMove);
		document.addEventListener("mouseup", handleMouseUp);

		return () => {
			document.removeEventListener("mousemove", handleMouseMove);
			document.removeEventListener("mouseup", handleMouseUp);
		};
	}, [isDragging]);

	useEffect(() => {
		const styleId = "side-panel-page-shrink";
		let styleTag = document.getElementById(styleId) as HTMLStyleElement;

		if (isOpen) {
			if (!styleTag) {
				styleTag = document.createElement("style");
				styleTag.id = styleId;
				document.head.appendChild(styleTag);
			}
			styleTag.textContent = `
          html {
            width: calc(100% - ${sideWidth}px) !important;
            position: relative !important;
            min-height: 100vh !important;
          }
        `;
		} else {
			if (styleTag) {
				document.head.removeChild(styleTag);
			}
		}

		return () => {
			if (styleTag && document.head.contains(styleTag)) {
				document.head.removeChild(styleTag);
			}
		};
	}, [isOpen, sideWidth]);

	return (
		<div style={{ fontFamily: "system-ui" }}>
			{/** biome-ignore lint/a11y/noStaticElementInteractions: static */}
			<div
				onMouseEnter={() => setIsHovered(true)}
				onMouseLeave={() => setIsHovered(false)}
				style={{
					position: "fixed",
					top: `${yRatio * 100}vh`,
					right: isOpen ? `${sideWidth + 20}px` : "0px",
					display: "flex",
					flexDirection: "column",
					alignItems: "flex-end",
					gap: "12px",
					zIndex: 2147483646,
					cursor: isDragging ? "grabbing" : "grab",
					transition: isDragging ? "none" : "right 0.3s ease",
				}}
			>
				<LibraryFloatingButton isHovered={isHovered} />

				<HanspoonFloatingButton
					isHover={isHovered}
					handleMouseDown={handleMouseDown}
					setIsOpen={setIsOpen}
					isDragging={isDragging}
					isOpen={isOpen}
					hasMoved={hasMoved}
				/>
			</div>

			<SidePanel sideWidth={sideWidth} isOpen={isOpen} setIsOpen={setIsOpen} />
		</div>
	);
};
