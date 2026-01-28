import { useEffect, useState } from "react";
import {
	checkEnabledForDomain,
	useFloatingButtonSettingsBase,
} from "../../../store/useFloatingButtonSettingsBase";

export const useFloatingButtonSettings = () => {
	const base = useFloatingButtonSettingsBase();
	const [currentTabDomain, setCurrentTabDomain] = useState<string>("");

	useEffect(() => {
		const loadCurrentTabDomain = async () => {
			try {
				const tabs = await browser.tabs.query({
					active: true,
					currentWindow: true,
				});

				if (tabs[0]?.url) {
					const url = new URL(tabs[0].url);
					setCurrentTabDomain(url.hostname);
				}
			} catch (error) {
				console.error("❌ [Popup] Failed to load current tab:", error);
			}
		};

		loadCurrentTabDomain();
	}, []);

	const enableForCurrentSite = () => {
		if (currentTabDomain) {
			base.enableForSite(currentTabDomain);
		}
	};

	const isEnabledGlobally = () => {
		return base.config.enabled;
	};

	const isEnabledForCurrentSite = () => {
		if (!currentTabDomain) return false;
		return checkEnabledForDomain(base.config, currentTabDomain);
	};

	return {
		config: base.config,
		isLoaded: base.isLoaded,
		currentTabDomain,
		enableGlobally: base.enableGlobally,
		enableForCurrentSite,
		isEnabledGlobally,
		isEnabledForCurrentSite,
	};
};
