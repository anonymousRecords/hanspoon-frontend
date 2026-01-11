import { createClient } from "@supabase/supabase-js";
import menuDots from "../../../../public/menu-dots.svg";
import { Dropdown, type DropdownMenuItem } from "../common/Dropdown";

const supabase = createClient(
	import.meta.env.VITE_SUPABASE_URL,
	import.meta.env.VITE_SUPABASE_ANON_KEY,
);

export const CardMoreGuestDropdown = () => {
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

	const menuItems: DropdownMenuItem[] = [
		{
			label: "google login",
			onClick: () => {
				handleLogin();
			},
		},
		{
			label: "remove",
			onClick: () => {},
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
