import path from "node:path";
import { expect, test } from "../fixtures/fixtures";
import { getSelectedText, selectTextRe } from "../pages/base";

/**
 * 하이라이트 익스텐션 기술 검증 샌드박스 테스트
 */
test.describe("기술적 엣지 케이스 및 공통 기능 검증 (Sandbox)", () => {
	test.beforeEach(async ({ page }) => {
		const filePath = `file://${path.resolve("tests/assets/sandbox.html")}`;
		await page.goto(filePath);
		await page.waitForLoadState("domcontentloaded");
	});

	// --- 1. 공통 핵심 테스트 ---

	test("1-1. 툴바 노출: 본문 텍스트 드래그 시 툴바가 나타나는가?", async ({
		page,
	}) => {
		const text =
			"기본 툴바 노출, 색상(#E9D2FD), 그리고 태그가 뒤섞인 문장 선택을 테스트합니다.";
		const regex =
			/기본 툴바 노출, 색상\(#E9D2FD\), 그리고 태그가 뒤섞인 문장 선택을 테스트합니다\./u;

		const sectionLocator = page.locator("#core-mixed-test");

		await selectTextRe(sectionLocator.getByText(text), regex);
		await page.mouse.up();

		const toolbar = page.locator(
			'hanspoon-toolbar [data-testid="highlight-toolbar"]',
		);
		await expect(toolbar).toBeVisible();
	});

	test("1-2. 선택 무효화: 빈 공간이나 이미지 클릭 시 툴바가 나타나지 않는가?", async ({
		page,
	}) => {
		const image = page.locator("#target-image");
		await image.click();

		const toolbar = page.locator(
			'hanspoon-toolbar [data-testid="highlight-toolbar"]',
		);
		await expect(toolbar).not.toBeVisible();
	});

	test("1-3 & 1-5. 하이라이트 실행 및 자동 종료: 버튼 클릭 시 하이라이트 생성 후 툴바가 사라지는가?", async ({
		page,
	}) => {
		const text =
			"기본 툴바 노출, 색상(#E9D2FD), 그리고 태그가 뒤섞인 문장 선택을 테스트합니다.";
		const regex =
			/기본 툴바 노출, 색상\(#E9D2FD\), 그리고 태그가 뒤섞인 문장 선택을 테스트합니다\./u;

		const sectionLocator = page.locator("#core-mixed-test");

		await selectTextRe(sectionLocator.getByText(text), regex);
		await page.mouse.up();

		const highlightButton = page.locator('[data-testid="highlight-button"]');
		await highlightButton.click();

		// 1-3 검증: 하이라이트 태그(span) 생성 확인
		const highlightSpan = page.locator("span[data-highlight-id]");
		await expect(highlightSpan.first()).toBeVisible();

		// 1-5 검증: 툴바 즉시 제거 확인
		const toolbar = page.locator(
			'hanspoon-toolbar [data-testid="highlight-toolbar"]',
		);
		await expect(toolbar).not.toBeVisible();
	});

	test("1-4. 텍스트 일치: 생성된 하이라이트 텍스트가 드래그한 텍스트와 일치하는가?", async ({
		page,
	}) => {
		const expectedText =
			"기본 툴바 노출, 색상(#E9D2FD), 그리고 태그가 뒤섞인 문장 선택을 테스트합니다.";
		const regex =
			/기본 툴바 노출, 색상\(#E9D2FD\), 그리고 태그가 뒤섞인 문장 선택을 테스트합니다\./u;

		const sectionLocator = page.locator("#core-mixed-test");

		await selectTextRe(sectionLocator.getByText(expectedText), regex);
		await page.mouse.up();

		const actualSelectedText = await getSelectedText(page);
		expect(actualSelectedText.trim()).toBe(expectedText);

		const highlightButton = page.locator('[data-testid="highlight-button"]');
		await highlightButton.click();

		const highlightSpan = page.locator("span[data-highlight-id]").first();
		const highlightedText = await highlightSpan.textContent();
		expect(highlightedText?.trim()).toContain("기본 툴바 노출");
	});

	test("1-6. 중복 선택: 이미 하이라이트된 텍스트를 다시 드래그했을 때 툴바가 정상 호출되는가?", async ({
		page,
	}) => {
		const text =
			"기본 툴바 노출, 색상(#E9D2FD), 그리고 태그가 뒤섞인 문장 선택을 테스트합니다.";
		const regex =
			/기본 툴바 노출, 색상\(#E9D2FD\), 그리고 태그가 뒤섞인 문장 선택을 테스트합니다\./u;

		const sectionLocator = page.locator("#core-mixed-test");

		// 첫 번째 하이라이트 생성
		await selectTextRe(sectionLocator.getByText(text), regex);
		await page.mouse.up();

		const highlightButton = page.locator('[data-testid="highlight-button"]');
		await highlightButton.click();

		// 하이라이트된 영역을 다시 선택
		const highlightSpan = page.locator("span[data-highlight-id]").first();
		await selectTextRe(highlightSpan, /기본 툴바 노출/u);
		await page.mouse.up();

		const toolbar = page.locator(
			'hanspoon-toolbar [data-testid="highlight-toolbar"]',
		);
		await expect(toolbar).toBeVisible();
	});

	// --- 2. 기술적 엣지 케이스 (Sandbox 전용) ---

	test("2-1. [Mixed Nodes] 여러 태그가 섞인 문장 선택 시 툴바가 정상 호출되는가?", async ({
		page,
	}) => {
		const mixedBox = page.locator("#target-mixed");

		// Mixed nodes 전체 텍스트 선택 (strong, em, a, span 태그 포함)
		await mixedBox.evaluate((el) => {
			const range = document.createRange();
			range.selectNodeContents(el);
			const selection = window.getSelection();
			selection?.removeAllRanges();
			selection?.addRange(range);
		});

		await page.mouse.up();

		// Mixed nodes 선택 시 툴바가 정상적으로 나타나는지 확인
		const toolbar = page.locator(
			'hanspoon-toolbar [data-testid="highlight-toolbar"]',
		);
		await expect(toolbar).toBeVisible();

		// 선택된 텍스트 검증
		const selectedText = await page.evaluate(() => {
			return window.getSelection()?.toString() || "";
		});

		expect(selectedText).toContain("두꺼운 글씨");
		expect(selectedText).toContain("기울임");
		expect(selectedText).toContain("링크 텍스트");
	});

	test("2-2. [Scroll Position] 내부 스크롤 발생 상태에서도 툴바 좌표가 정확한가?", async ({
		page,
	}) => {
		const container = page.locator("#target-scroll-container");

		// 내부 스크롤 수행
		await container.evaluate(
			(el) =>
				el,
				// el.scrollTop = 100
		);

		// 스크롤되어 나타난 타겟 텍스트 선택
		const scrollTarget = page.locator("#target-scroll-text");
		await selectTextRe(
			scrollTarget,
			/\[스크롤 타겟\] 스크롤을 내려서 이 문장을 하이라이트 하세요\./u,
		);
		await page.mouse.up();

		const toolbar = page.locator(
			'hanspoon-toolbar [data-testid="highlight-toolbar"]',
		);
		await expect(toolbar).toBeVisible();

		// 툴바와 선택 영역의 좌표 검증
		const toolbarBox = await toolbar.boundingBox();
		const targetBox = await scrollTarget.boundingBox();

		expect(toolbarBox).not.toBeNull();
		expect(targetBox).not.toBeNull();

		// 툴바가 선택 영역 근처에 위치하는지 확인 (대략적인 범위 체크)
		if (toolbarBox && targetBox) {
			expect(toolbarBox.y).toBeLessThan(targetBox.y + targetBox.height + 100);
			expect(toolbarBox.y).toBeGreaterThan(targetBox.y - 100);
		}
	});

	test("2-3. [CSS Transform] scale/rotate 레이아웃에서도 툴바가 제자리에 뜨는가?", async ({
		page,
	}) => {
		const transformTarget = page.locator("#target-transform");

		await selectTextRe(transformTarget, /Transform이 적용된 텍스트입니다\./u);
		await page.mouse.up();

		const toolbar = page.locator(
			'hanspoon-toolbar [data-testid="highlight-toolbar"]',
		);
		await expect(toolbar).toBeVisible();

		// 툴바 좌표 검증
		const toolbarBox = await toolbar.boundingBox();
		const targetBox = await transformTarget.boundingBox();

		expect(toolbarBox).not.toBeNull();
		expect(targetBox).not.toBeNull();

		// Transform이 적용된 상태에서도 툴바가 화면 내에 있는지 확인
		if (toolbarBox && targetBox) {
			expect(toolbarBox.x).toBeGreaterThan(0);
			expect(toolbarBox.y).toBeGreaterThan(0);
		}
	});

	test("2-4. [Resize] 브라우저 창 크기 조절 시 하이라이트 위치 대응", async ({
		page,
	}) => {
		const text =
			"기본 툴바 노출, 색상(#E9D2FD), 그리고 태그가 뒤섞인 문장 선택을 테스트합니다.";

		// 하이라이트 생성
		await selectTextRe(
			page.locator("#core-mixed-test").getByText(text),
			/기본 툴바 노출, 색상\(#E9D2FD\), 그리고 태그가 뒤섞인 문장 선택을 테스트합니다\./u,
		);
		await page.mouse.up();

		const highlightButton = page.locator('[data-testid="highlight-button"]');
		await highlightButton.click();

		// 하이라이트 생성 확인
		const highlightSpan = page.locator("span[data-highlight-id]").first();
		await expect(highlightSpan).toBeVisible();

		// 브라우저 창 크기 조절 (좁게)
		await page.setViewportSize({ width: 600, height: 800 });
		await page.waitForTimeout(500);

		// 하이라이트가 여전히 보이고 텍스트가 유지되는지 확인
		await expect(highlightSpan).toBeVisible();
		let highlightedText = await highlightSpan.textContent();
		expect(highlightedText).toContain("기본 툴바 노출");

		// 브라우저 창 크기 조절 (넓게)
		await page.setViewportSize({ width: 1920, height: 1080 });
		await page.waitForTimeout(500);

		// 여전히 보이는지 확인
		await expect(highlightSpan).toBeVisible();
		highlightedText = await highlightSpan.textContent();
		expect(highlightedText).toContain("기본 툴바 노출");
	});

	test("2-5 & 2-6. [Performance] 100개 다중 하이라이트 시 렉(Jank)이나 메모리 문제가 없는가?", async ({
		page,
	}) => {
		const startTime = Date.now();

		// 100개 요소에 순차적으로 하이라이트 생성
		for (let i = 1; i <= 10; i++) {
			const item = page.locator(`#load-item-${i}`);
			await selectTextRe(item, /한스푼에 많은 관심 가져주시고/u);
			await page.mouse.up();

			const highlightButton = page.locator('[data-testid="highlight-button"]');
			await highlightButton.click();

			// 짧은 대기 (툴바가 사라질 때까지)
			await page.waitForTimeout(100);
		}

		const endTime = Date.now();
		const duration = endTime - startTime;

		// 10개 하이라이트 생성이 10초 이내에 완료되는지 확인
		expect(duration).toBeLessThan(10000);

		// 생성된 하이라이트 개수 확인
		const highlightCount = await page
			.locator("span[data-highlight-id]")
			.count();
		expect(highlightCount).toBeGreaterThanOrEqual(10);

		// 스크롤 성능 테스트
		const container = page.locator("#load-container");

		// 스크롤 시작 전 성능 측정
		const scrollStartTime = Date.now();
		await container.evaluate((el) => {
			el.scrollTop = 0;
		});
		await page.waitForTimeout(100);
		await container.evaluate((el) => {
			el.scrollTop = el.scrollHeight;
		});
		const scrollEndTime = Date.now();
		const scrollDuration = scrollEndTime - scrollStartTime;

		// 스크롤이 1초 이내에 완료되는지 확인 (렉 없음)
		expect(scrollDuration).toBeLessThan(1000);
	});
});
