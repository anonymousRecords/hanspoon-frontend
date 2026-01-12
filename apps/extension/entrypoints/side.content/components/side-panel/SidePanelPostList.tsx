import { useLiveQuery } from "dexie-react-hooks";
import { useEffect, useState } from "react";
import { getAllPosts } from "@/apis/fetcher";
import { getBroadcastChannel } from "@/lib/broadcast/channel";
import { PostCard } from "./PostCard";

export const SidePanelPostList = () => {
	const [refreshKey, setRefreshKey] = useState(0);
	const allPosts = useLiveQuery(getAllPosts, [refreshKey]);

	useEffect(() => {
		const channel = getBroadcastChannel();
		channel.onMessage((message) => {
			if (message.type === "POST_ADDED") {
				setRefreshKey((prev) => prev + 1);
			}
		});
	}, []);

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
				height: "100%",
			}}
		>
			<div
				style={{
					flex: 1,
					overflowY: "auto",
					marginBottom: "20px",
				}}
			>
				<div
					style={{
						display: "flex",
						flexDirection: "column",
						gap: "8px",
					}}
				>
					<div
						style={{
							fontSize: "14px",
						}}
					>
						모든 포스트
					</div>
					{allPosts.map((post) => (
						<PostCard key={post.id} post={post} />
					))}
				</div>
			</div>
		</div>
	);
};
