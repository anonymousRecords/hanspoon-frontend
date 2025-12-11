import "./style.css";
import ReactDOM from "react-dom/client";
import Toolbar from "@/components/toolbar/Toolbar";
import { restoreHighlights } from "@/lib/highlight/restore";

export default defineContentScript({
	matches: ["<all_urls>"],
	cssInjectionMode: "ui",

	async main(ctx) {
		console.log("HELLO");

		restoreHighlights();

		const ui = await createShadowRootUi(ctx, {
			name: "hanspoon-toolbar",
			position: "inline",
			onMount: (container) => {
				const root = ReactDOM.createRoot(container);
				root.render(<Toolbar />);
				return root;
			},
		});

		ui.mount();
	},
});
