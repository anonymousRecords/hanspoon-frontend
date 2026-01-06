import { HanspoonFloatingButton } from "./floating-button/haspoon-floating-button";
import { LibraryFloatingButton } from "./floating-button/library-floating-button";
import { SidePanel } from "./side-panel/SidePanel";

export const FloatingTab = () => {
	const [isOpen, setIsOpen] = useState(false);
	const [sideWidth] = useState(400);
	const [isHovered, setIsHovered] = useState(false);
	const [position, setPosition] = useState({ top: 300, right: 0 });
	const [isDragging, setIsDragging] = useState(false);
	const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

	useEffect(() => {
		const handleMouseMove = (e: MouseEvent) => {
			if (!isDragging) return;

			const deltaX = e.clientX - dragStart.x;
			const deltaY = e.clientY - dragStart.y;

			setPosition((prev) => ({
				top: Math.max(0, Math.min(window.innerHeight - 100, prev.top + deltaY)),
				right: Math.max(
					0,
					Math.min(window.innerWidth - 100, prev.right - deltaX),
				),
			}));

			setDragStart({ x: e.clientX, y: e.clientY });
		};

		const handleMouseUp = () => {
			setIsDragging(false);
		};

		if (isDragging) {
			document.addEventListener("mousemove", handleMouseMove);
			document.addEventListener("mouseup", handleMouseUp);
		}

		return () => {
			document.removeEventListener("mousemove", handleMouseMove);
			document.removeEventListener("mouseup", handleMouseUp);
		};
	}, [isDragging, dragStart]);

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

	const handleMouseDown = (e: React.MouseEvent) => {
		setIsDragging(true);
		setDragStart({ x: e.clientX, y: e.clientY });
	};

	return (
		<div style={{ fontFamily: "system-ui" }}>
			{/** biome-ignore lint/a11y/noStaticElementInteractions: static */}
			<div
				onMouseEnter={() => setIsHovered(true)}
				onMouseLeave={() => setIsHovered(false)}
				style={{
					position: "fixed",
					top: `${position.top}px`,
					right: `${position.right}px`,
					display: "flex",
					flexDirection: "column",
					alignItems: "flex-end",
					gap: "12px",
					zIndex: 2147483646,
					cursor: isDragging ? "grabbing" : "grab",
				}}
			>
				<LibraryFloatingButton isHovered={isHovered} />

				<HanspoonFloatingButton
					isHover={isHovered}
					handleMouseDown={() => handleMouseDown}
					setIsOpen={setIsOpen}
					isDragging={isDragging}
					isOpen={isOpen}
				/>
			</div>

			<SidePanel sideWidth={sideWidth} isOpen={isOpen} setIsOpen={setIsOpen} />
		</div>
	);
};
