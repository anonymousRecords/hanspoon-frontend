import type { Locator, Page } from "@playwright/test";

export async function selectTextRe(
	locator: Locator,
	pattern: string | RegExp,
	flags?: string,
): Promise<void> {
	await locator.evaluate(
		(element, { pattern, flags }) => {
			// 모든 텍스트 노드를 수집
			const textNodes: Text[] = [];
			const walker = document.createTreeWalker(
				element,
				NodeFilter.SHOW_TEXT,
				null,
			);

			let node = walker.nextNode();
			while (node) {
				textNodes.push(node as Text);
				node = walker.nextNode();
			}

			// 전체 텍스트 구성
			const fullText = textNodes.map((n) => n.textContent).join("");
			const match = fullText.match(new RegExp(pattern, flags));

			if (!match || match.index === undefined) {
				return;
			}

			const startOffset = match.index;
			const endOffset = startOffset + match[0].length;

			let currentOffset = 0;
			let startNode: Text | null = null;
			let startNodeOffset = 0;
			let endNode: Text | null = null;
			let endNodeOffset = 0;

			for (const textNode of textNodes) {
				const nodeLength = textNode.textContent?.length || 0;

				if (startNode === null && currentOffset + nodeLength > startOffset) {
					startNode = textNode;
					startNodeOffset = startOffset - currentOffset;
				}

				if (currentOffset + nodeLength >= endOffset) {
					endNode = textNode;
					endNodeOffset = endOffset - currentOffset;
					break;
				}

				currentOffset += nodeLength;
			}

			if (startNode && endNode) {
				const range = document.createRange();
				range.setStart(startNode, startNodeOffset);
				range.setEnd(endNode, endNodeOffset);
				const selection = document.getSelection();
				selection?.removeAllRanges();
				selection?.addRange(range);
			}
		},
		{ pattern, flags },
	);
}

export async function getSelectedText(page: Page): Promise<string> {
	return await page.evaluate(() => {
		const selection = document.getSelection();

		return selection?.toString() ?? "";
	});
}
