import { type ReactNode, useEffect } from "react";
import { createPortal } from "react-dom";

interface ModalProps {
	isOpen: boolean;
	onClose: () => void;
	title?: string;
	children: ReactNode;
	confirmText?: string;
	cancelText?: string;
	onConfirm?: () => void;
	confirmVariant?: "default" | "danger";
}

export const Modal = ({
	isOpen,
	onClose,
	title,
	children,
	confirmText = "확인",
	cancelText = "취소",
	onConfirm,
	confirmVariant = "default",
}: ModalProps) => {
	useEffect(() => {
		const handleEscape = (e: KeyboardEvent) => {
			if (e.key === "Escape") {
				onClose();
			}
		};

		if (isOpen) {
			document.addEventListener("keydown", handleEscape);
			return () => document.removeEventListener("keydown", handleEscape);
		}
	}, [isOpen, onClose]);

	if (!isOpen) return null;

	const confirmButtonColor =
		confirmVariant === "danger" ? "#ef4444" : "#3b82f6";
	const confirmButtonHoverColor =
		confirmVariant === "danger" ? "#dc2626" : "#2563eb";

	return createPortal(
		<>
			{/** biome-ignore lint/a11y/noStaticElementInteractions: backdrop */}
			{/** biome-ignore lint/a11y/useKeyWithClickEvents: backdrop click */}
			<div
				style={{
					position: "fixed",
					inset: 0,
					backgroundColor: "rgba(0, 0, 0, 0.5)",
					zIndex: 2147483647,
				}}
				onClick={onClose}
			/>
			<div
				style={{
					position: "fixed",
					top: "50%",
					left: "50%",
					transform: "translate(-50%, -50%)",
					backgroundColor: "white",
					borderRadius: "12px",
					padding: "24px",
					minWidth: "300px",
					maxWidth: "400px",
					boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2)",
					zIndex: 2147483648,
				}}
			>
				{title && (
					<h2
						style={{
							margin: "0 0 16px 0",
							fontSize: "18px",
							fontWeight: "600",
							color: "#111827",
						}}
					>
						{title}
					</h2>
				)}
				<div
					style={{
						fontSize: "14px",
						color: "#4b5563",
						lineHeight: "1.5",
						marginBottom: "24px",
					}}
				>
					{children}
				</div>
				<div
					style={{
						display: "flex",
						justifyContent: "flex-end",
						gap: "8px",
					}}
				>
					<button
						type="button"
						onClick={onClose}
						style={{
							padding: "8px 16px",
							fontSize: "14px",
							fontWeight: "500",
							color: "#374151",
							backgroundColor: "#f3f4f6",
							border: "none",
							borderRadius: "6px",
							cursor: "pointer",
						}}
						onMouseEnter={(e) => {
							e.currentTarget.style.backgroundColor = "#e5e7eb";
						}}
						onMouseLeave={(e) => {
							e.currentTarget.style.backgroundColor = "#f3f4f6";
						}}
					>
						{cancelText}
					</button>
					{onConfirm && (
						<button
							type="button"
							onClick={onConfirm}
							style={{
								padding: "8px 16px",
								fontSize: "14px",
								fontWeight: "500",
								color: "white",
								backgroundColor: confirmButtonColor,
								border: "none",
								borderRadius: "6px",
								cursor: "pointer",
							}}
							onMouseEnter={(e) => {
								e.currentTarget.style.backgroundColor = confirmButtonHoverColor;
							}}
							onMouseLeave={(e) => {
								e.currentTarget.style.backgroundColor = confirmButtonColor;
							}}
						>
							{confirmText}
						</button>
					)}
				</div>
			</div>
		</>,
		document.body,
	);
};
