import { useTextSelection } from "@/hooks/useTextSelection";
import { useFloatingButtonStatus } from "../../hooks/useFloatingButtonStatus";
import { CreationModeUI } from "./CreationModeUI";
import { EditModeUI } from "./EditModeUI";

export const Toolbar = () => {
	const { clientRect, isCollapsed, range } = useTextSelection();
	const { isEnabledForCurrentSite } = useFloatingButtonStatus();

	const enabled = isEnabledForCurrentSite();

	if (!enabled) {
		return null;
	}

	if (clientRect === undefined) {
		return null;
	} else if (!isCollapsed && range !== undefined) {
		return <CreationModeUI targetRect={clientRect} range={range} />;
	} else {
		return <EditModeUI />;
	}
};
