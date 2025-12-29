import { supabase } from "../lib/supabase";

export const fetchUserInfo = async () => {
	const { data, error } = await supabase.auth.getUser();

	if (error) {
		throw error;
	}

	return data.user;
};

export const fetchAuthSession = async () => {
	const { data, error } = await supabase.auth.getSession();

	if (error) {
		throw error;
	}

	if (data.session === null) {
		throw new Error("세션이 존재하지 않습니다");
	}

	return data.session;
};
