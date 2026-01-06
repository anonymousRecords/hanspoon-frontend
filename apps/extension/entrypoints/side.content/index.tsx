import ReactDOM from "react-dom/client";
import { FloatingTab } from "./components/FloatingTab";

export default defineContentScript({
	matches: ["*://*/*"],
	cssInjectionMode: "ui",
	async main(ctx) {
		const ui = await createShadowRootUi(ctx, {
			name: "hanspoon-side-panel",
			position: "overlay",
			anchor: "body",
			append: "last",
			onMount: (container) => {
				const wrapper = document.createElement("div");
				container.appendChild(wrapper);

				const root = ReactDOM.createRoot(wrapper);
				root.render(<FloatingTab />);

				return { root, wrapper };
			},
			onRemove: (elements) => {
				elements?.root.unmount();
			},
		});

		ui.mount();
	},
});
