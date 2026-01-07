import type { Session } from "@supabase/supabase-js";
import { useEffect, useState } from "react";

export const useSession = () => {
	const [session, setSession] = useState<Session | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		browser.storage.local.get("session").then((res) => {
			if (res.session) setSession(res.session);
			setLoading(false);
		});

		const handleStorageChange = (changes: {
			[key: string]: Browser.storage.StorageChange;
		}) => {
			if (changes.session) {
				setSession(changes.session.newValue);
			}
		};

		browser.storage.onChanged.addListener(handleStorageChange);
		return () => browser.storage.onChanged.removeListener(handleStorageChange);
	}, []);

	return { session, loading };
};
