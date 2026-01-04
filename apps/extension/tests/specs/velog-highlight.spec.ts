import { expect, test } from "../fixtures/fixtures";
import { getSelectedText, selectTextRe } from "../pages/velog";

test.describe("벨로그 요소별 하이라이트 상세 테스트", () => {
	test("일반 텍스트 및 인용문 하이라이트 영역 선택 검증", async ({ page }) => {
		page.on("console", (msg) => {
			console.log(msg);
		});

		await page.goto(
			"https://velog.io/@hanspoon/%ED%85%8C%EC%8A%A4%ED%8A%B8-%ED%95%98%EC%9D%B4%EB%9D%BC%EC%9D%B4%ED%8A%B8-%EC%9D%B5%EC%8A%A4%ED%85%90%EC%85%98-%EA%B8%B0%EB%8A%A5-%EA%B2%80%EC%A6%9D%EC%9A%A9-%EC%83%98%ED%94%8C-%EC%95%84%ED%8B%B0%ED%81%B4",
		);
		const text = "이 부분은 인용문(Blockquote)입니다";
		const regex = /이 부분은 인용문\(Blockquote\)입니다/u;

		const velogContentLocator = page.locator(".atom-one");

		await selectTextRe(velogContentLocator.getByText(text), regex);

		await page.mouse.up();

		const actualSelectedText = await getSelectedText(page);

		expect(actualSelectedText.trim()).toBe(text);

		const toolbar = page.locator(
			'hanspoon-toolbar [data-testid="highlight-toolbar"]',
		);

		await expect(toolbar).toBeVisible();

		const isSelectionRangeValid = await page.evaluate(() => {
			const sel = window.getSelection();
			if (!sel || sel.rangeCount === 0) return false;
			const rect = sel.getRangeAt(0).getBoundingClientRect();
			return rect.width > 0 && rect.height > 0;
		});
		expect(isSelectionRangeValid).toBe(true);
	});
});
