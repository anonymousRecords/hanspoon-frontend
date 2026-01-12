import { createClient } from "@supabase/supabase-js";
import type { LocalPost } from "@/lib/highlight/types";
import {
	deleteAnnotationsByPostId,
	deletePost,
} from "../../../../apis/fetcher";
import menuDots from "../../../../public/menu-dots.svg";
import { Dropdown, type DropdownMenuItem } from "../common/Dropdown";

const supabase = createClient(
	import.meta.env.VITE_SUPABASE_URL,
	import.meta.env.VITE_SUPABASE_ANON_KEY,
);

interface CardMoreGuestDropdownProps {
	post: LocalPost;
}

export const CardMoreGuestDropdown = ({ post }: CardMoreGuestDropdownProps) => {
	const handleLogin = async () => {
		try {
			const { data, error } = await supabase.auth.signInWithOAuth({
				provider: "google",
				options: {
					queryParams: {
						access_type: "offline",
						prompt: "consent",
					},
					redirectTo: `http://localhost:5173/auth/callback`,
				},
			});

			if (error) {
				console.error("Google 로그인 오류:", error);
				return;
			}

			if (data.url !== null) {
				browser.tabs.create({ url: data.url });
			}
		} catch (error) {
			console.error("Unexpected crash:", error);
		}
	};

	const handleRemove = async () => {
		if (
			!confirm(
				"이 포스트를 삭제하시겠습니까? 관련된 모든 하이라이트도 함께 삭제됩니다.",
			)
		) {
			return;
		}

		try {
			await deleteAnnotationsByPostId(post.id);
			await deletePost(post.id);

			alert("포스트가 삭제되었습니다.");
			// TODO: 목록 새로고침 필요 (부모 컴포넌트에 알려야 함)
		} catch (error) {
			console.error("포스트 삭제 실패:", error);
			alert("포스트 삭제에 실패했습니다.");
		}
	};

	const menuItems: DropdownMenuItem[] = [
		{
			label: "google login",
			onClick: () => {
				handleLogin();
			},
		},
		{
			label: "remove",
			onClick: handleRemove,
		},
	];

	return (
		<Dropdown
			trigger={
				<img
					src={menuDots}
					width={12}
					height={12}
					alt="menu-dot"
					style={{ cursor: "pointer" }}
				/>
			}
			items={menuItems}
			position="bottom-right"
		/>
	);
};
