import { useEffect, useState } from "react";
import { getPostByUrl } from "@/apis/fetcher";
import type { LocalPost } from "@/lib/highlight/types";

export const useCurrentPost = () => {
	const [currentPost, setCurrentPost] = useState<LocalPost | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchCurrentPost = async () => {
			try {
				setLoading(true);
				const currentUrl = window.location.href;
				const post = await getPostByUrl(currentUrl);
				setCurrentPost(post || null);
			} catch (error) {
				console.error("Failed to fetch current post:", error);
				setCurrentPost(null);
			} finally {
				setLoading(false);
			}
		};

		fetchCurrentPost();
	}, []);

	return { currentPost, loading };
};
