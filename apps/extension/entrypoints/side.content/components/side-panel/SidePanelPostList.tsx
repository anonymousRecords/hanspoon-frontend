import { useLiveQuery } from "dexie-react-hooks";
import { getAllPosts } from "@/apis/fetcher";

export const SidePanelPostList = () => {
	const allPosts = useLiveQuery(getAllPosts);

	if (allPosts === undefined) {
		return null;
	}

	if (allPosts.length === 0) {
		return (
			<div
				style={{
					padding: "20px",
					textAlign: "center",
					color: "#6b7280",
				}}
			>
				저장된 포스트가 없습니다.
			</div>
		);
	}

	return (
		<div
			style={{
				display: "flex",
				flexDirection: "column",
				gap: "12px",
			}}
		>
			{allPosts.map((post) => (
				/** biome-ignore lint/a11y/useKeyWithClickEvents: Post card click handler */
				/** biome-ignore lint/a11y/noStaticElementInteractions: Post card clickable */
				<div
					key={post.id}
					style={{
						padding: "16px",
						border: "1px solid #e5e7eb",
						borderRadius: "8px",
						cursor: "pointer",
						transition: "all 0.2s",
						backgroundColor: "white",
					}}
					onMouseEnter={(e) => {
						e.currentTarget.style.backgroundColor = "#f9fafb";
						e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.1)";
					}}
					onMouseLeave={(e) => {
						e.currentTarget.style.backgroundColor = "white";
						e.currentTarget.style.boxShadow = "none";
					}}
					onClick={() => {
						window.open(post.url, "_blank");
					}}
				>
					<div
						style={{
							display: "flex",
							alignItems: "center",
							gap: "8px",
							marginBottom: "8px",
						}}
					>
						{post.favIconUrl && (
							<img
								src={post.favIconUrl}
								alt=""
								style={{
									width: "16px",
									height: "16px",
									borderRadius: "2px",
								}}
							/>
						)}
						<div
							style={{
								fontSize: "12px",
								color: "#6b7280",
							}}
						>
							{post.sourceDomain}
						</div>
					</div>
					<div
						style={{
							fontSize: "16px",
							fontWeight: "600",
							marginBottom: "8px",
							color: "#111827",
						}}
					>
						{post.title}
					</div>
					<div
						style={{
							fontSize: "12px",
							color: "#9ca3af",
						}}
					>
						{new Date(post.updatedAt).toLocaleDateString("ko-KR", {
							year: "numeric",
							month: "long",
							day: "numeric",
						})}
					</div>
				</div>
			))}
		</div>
	);
};
