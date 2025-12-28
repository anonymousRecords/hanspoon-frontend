interface BaseLayoutProps {
	children: React.ReactNode;
}

export const BaseLayout = ({ children }: BaseLayoutProps) => {
	return (
		<div
			style={{
				padding: "64px",
				display: "flex",
				justifyContent: "space-around",
			}}
		>
			{children}
		</div>
	);
};
