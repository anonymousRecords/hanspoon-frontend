import type { Session } from "@supabase/supabase-js";
import { useEffect } from "react";
import { fetchAuthSession } from "../apis/auth.api";

const AuthCallback = () => {
	useEffect(() => {
		if (typeof window === "undefined") {
			return;
		}

		const checkSession = async () => {
			try {
				const session = await fetchAuthSession();
				const { success } = await sendLoginMessage(session);

				if (success) {
					console.log("익스텐션이 메시지를 잘 받았어요!");
				}
			} catch (error) {
				console.error("인증 확인 중 오류 발생:", error);
			}
		};

		checkSession();
	}, []);

	return (
		<div
			style={{
				display: "flex",
				justifyContent: "center",
				alignItems: "center",
				height: "100vh",
			}}
		>
			<div>로그인 처리 중...</div>
		</div>
	);
};

const sendLoginMessage = async (session: Session) => {
	return await chrome.runtime.sendMessage<
		{ type: "LOGIN_SUCCESS"; payload: Session },
		{ success: boolean }
	>(import.meta.env.VITE_EXTENSION_ID, {
		type: "LOGIN_SUCCESS" as const,
		payload: session,
	});
};

export default AuthCallback;
