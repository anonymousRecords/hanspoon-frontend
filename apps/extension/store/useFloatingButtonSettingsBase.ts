import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import {
	type FloatingButtonConfig,
	floatingButtonConfigAtom,
	floatingButtonSettingsAtom,
	getStorageConfig,
	STORAGE_KEY,
} from "./floatingButtonSettingsAtom";

export const useFloatingButtonSettingsBase = () => {
	const [config, setConfig] = useAtom(floatingButtonConfigAtom);
	const [, dispatch] = useAtom(floatingButtonSettingsAtom);
	const [isLoaded, setIsLoaded] = useState(false);

	useEffect(() => {
		getStorageConfig()
			.then((loadedConfig) => {
				setConfig(loadedConfig);
				setIsLoaded(true);
			})
			.catch(() => {
				setIsLoaded(true);
			});
	}, [setConfig]);

	useEffect(() => {
		const handleStorageChange = (changes: {
			[key: string]: Browser.storage.StorageChange;
		}) => {
			if (changes[STORAGE_KEY]) {
				const newConfig = changes[STORAGE_KEY].newValue as FloatingButtonConfig;
				setConfig(newConfig);
			}
		};

		browser.storage.onChanged.addListener(handleStorageChange);
		return () => browser.storage.onChanged.removeListener(handleStorageChange);
	}, [setConfig]);

	const disableForSite = (domain?: string) => {
		dispatch({ type: "DISABLE_FOR_SITE", payload: domain });
	};

	const disableGlobally = () => {
		dispatch({ type: "DISABLE_GLOBALLY" });
	};

	const enableGlobally = () => {
		dispatch({ type: "ENABLE_GLOBALLY" });
	};

	const enableForSite = (domain?: string) => {
		dispatch({ type: "ENABLE_FOR_SITE", payload: domain });
	};

	return {
		config,
		isLoaded,
		disableForSite,
		disableGlobally,
		enableGlobally,
		enableForSite,
	};
};

export function matchDomainPattern(
	currentDomain: string,
	pattern: string,
): boolean {
	if (currentDomain === pattern) return true;

	if (pattern.startsWith("*.")) {
		const domainSuffix = pattern.slice(2);
		return (
			currentDomain === domainSuffix ||
			currentDomain.endsWith(`.${domainSuffix}`)
		);
	}

	return currentDomain.endsWith(`.${pattern}`);
}

export function checkEnabledForDomain(
	config: FloatingButtonConfig,
	domain: string,
): boolean {
	if (!config.enabled) return false;
	return !config.disabledDomains.some((d) => matchDomainPattern(domain, d));
}
