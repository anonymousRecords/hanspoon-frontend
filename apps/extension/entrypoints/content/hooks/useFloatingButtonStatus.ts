import {
	checkEnabledForDomain,
	useFloatingButtonSettingsBase,
} from "../../../store/useFloatingButtonSettingsBase";

export const useFloatingButtonStatus = () => {
	const base = useFloatingButtonSettingsBase();

	const currentDomain = window.location.hostname;

	const disableForCurrentSite = () => {
		base.disableForSite(currentDomain);
	};

	const enableForCurrentSite = () => {
		base.enableForSite(currentDomain);
	};

	const isEnabledForCurrentSite = () => {
		return checkEnabledForDomain(base.config, currentDomain);
	};

	return {
		config: base.config,
		isLoaded: base.isLoaded,
		disableForCurrentSite,
		disableGlobally: base.disableGlobally,
		enableGlobally: base.enableGlobally,
		enableForCurrentSite,
		isEnabledForCurrentSite,
	};
};
