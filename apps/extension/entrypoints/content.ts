export default defineContentScript({
	matches: ["<all_urls>"],

	main(ctx) {
		const style = document.createElement("style");
		style.textContent = `
      ::highlight(hanspoon-marker) {
        background-color: #E9D2FD;
        color: black;
      }
    `;
		document.head.appendChild(style);

		function selectText() {
			const selection = window.getSelection();
			if (!selection || selection.rangeCount === 0) return;

			const range = selection.getRangeAt(0);

			const highlight = new Highlight(range);

			CSS.highlights.set("hanspoon-marker", highlight);

			selection.removeAllRanges();
		}

		document.addEventListener("mouseup", selectText);

		ctx.onInvalidated(() => {
			document.removeEventListener("mouseup", selectText);
			style.remove();
		});
	},
});
