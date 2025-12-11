import type { SerializedHighlight } from "@/lib/highlight/types";

export const STORAGE_KEY = "hanspoon_highlights";

export const saveHighlightToStorage = (data: SerializedHighlight) => {
	const prevDataString = localStorage.getItem(STORAGE_KEY);
	const prevData: SerializedHighlight[] = prevDataString
		? JSON.parse(prevDataString)
		: [];

	const newData = [...prevData, data];

	localStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
};

export const removeHighlightFromStorage = (id: string) => {
	const prevDataString = localStorage.getItem(STORAGE_KEY);
	if (!prevDataString) return;

	const prevData: SerializedHighlight[] = JSON.parse(prevDataString);
	const newData = prevData.filter((item) => item.id !== id);

	localStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
};
