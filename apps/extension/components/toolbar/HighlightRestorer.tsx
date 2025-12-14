import { useEffect } from "react";
import { useHighlights } from "@/hooks/useHighlights";
import { deserializeRange } from "@/lib/highlight/deserialization";
import { appendHighlightTag } from "@/lib/highlight/highlight";
import type { SerializedHighlight } from "@/lib/highlight/types";

export function HighlightRestorer() {
	const highlights = useHighlights();

	useEffect(() => {
		if (!highlights) return;

		try {
			highlights.forEach((data: SerializedHighlight) => {
				const range = deserializeRange(data);
				if (range) {
					appendHighlightTag(range, data.id);
				} else {
					console.warn(`복구 실패: ${data.id} (DOM이 변경되었을 수 있음)`);
				}
			});
		} catch (e) {
			console.error("하이라이트 데이터 처리 중 에러 발생", e);
		}
	}, [highlights]);

	return null;
}
