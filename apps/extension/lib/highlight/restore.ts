import { useHighlights } from "@/hooks/useHighlights";
import { deserializeRange } from "./deserialization";
import { applyHighlight } from "./highlight";
import type { SerializedHighlight } from "./types";

export const restoreHighlights = async () => {
	const highlights = await useHighlights();
	try {
		if (!highlights) return;
		const serializedHighlights: SerializedHighlight[] = highlights.map(
			(highlight) => ({
				id: highlight.id,
				start: highlight.start,
				end: highlight.end,
				text: highlight.text,
			}),
		);
		serializedHighlights.forEach((data) => {
			const range = deserializeRange(data);
			if (range) {
				applyHighlight(range, data.id);
			} else {
				console.warn(`복구 실패: ${data.id} (DOM이 변경되었을 수 있음)`);
			}
		});
	} catch (e) {
		console.error("하이라이트 데이터 처리 중 에러 발생", e);
	}
};
