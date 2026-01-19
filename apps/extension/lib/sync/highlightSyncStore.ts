import { getAllHighlightsByPostId } from "@/apis/fetcher";
import type { HighlightSyncMessage } from "@/entrypoints/background";
import { deserializeRange } from "@/lib/highlight/deserialization";
import { appendHighlightTag } from "@/lib/highlight/highlight";
import type { LocalAnnotation } from "@/lib/highlight/types";

interface HighlightSyncState {
	postId: string | null;
	highlights: LocalAnnotation[];
	lastSyncTimestamp: number;
}

class HighlightSyncStore {
	private state: HighlightSyncState = {
		postId: null,
		highlights: [],
		lastSyncTimestamp: 0,
	};

	private isListenerRegistered = false;

	constructor() {
		this.registerGlobalListener();
	}

	private registerGlobalListener() {
		if (this.isListenerRegistered) return;

		browser.runtime.onMessage.addListener(this.handleMessage);
		this.isListenerRegistered = true;
	}

	private handleMessage = async (message: unknown) => {
		if (!this.isHighlightSyncMessage(message)) {
			return;
		}

		switch (message.type) {
			case "HIGHLIGHT_CREATED": {
				if (!this.state.postId) {
					await this.initializeForUrl(window.location.href);
				}

				if (this.state.postId === message.postId) {
					await this.refreshHighlights();
				}
				break;
			}
			case "HIGHLIGHT_DELETED": {
				if (this.state.postId) {
					await this.refreshHighlights();
				}
				break;
			}
			case "POST_DELETED": {
				if (this.state.postId === message.postId) {
					this.state = {
						postId: null,
						highlights: [],
						lastSyncTimestamp: Date.now(),
					};
					this.unpaintHighlights();
				}
				break;
			}

			case "All_HIGHLIGHTS_DELETED": {
				if (this.state.postId === message.postId) {
					this.state = {
						...this.state,
						highlights: [],
						lastSyncTimestamp: Date.now(),
					};
					this.unpaintHighlights();
				}
				break;
			}
		}
	};

	private isHighlightSyncMessage(
		message: unknown,
	): message is HighlightSyncMessage {
		return (
			message !== null &&
			typeof message === "object" &&
			"type" in message &&
			typeof (message as { type: unknown }).type === "string" &&
			[
				"HIGHLIGHT_CREATED",
				"HIGHLIGHT_DELETED",
				"POST_CREATED",
				"POST_DELETED",
				"All_HIGHLIGHTS_DELETED",
			].includes((message as HighlightSyncMessage).type)
		);
	}

	private async refreshHighlights() {
		if (!this.state.postId) return;

		try {
			const highlights = await getAllHighlightsByPostId(this.state.postId);
			this.state = {
				...this.state,
				highlights,
				lastSyncTimestamp: Date.now(),
			};
			this.unpaintHighlights();
			this.paintHighlights(highlights);
		} catch (error) {
			console.error("[HighlightSyncStore] Failed to refresh:", error);
		}
	}

	private paintHighlights(highlights: LocalAnnotation[]) {
		for (const data of highlights) {
			try {
				const range = deserializeRange(data);
				appendHighlightTag(range, data.id);
			} catch (error) {
				console.warn(`[HighlightSyncStore] 복구 실패: ${data.id}`, error);
			}
		}
	}

	private unpaintHighlights() {
		const existingHighlights = document.querySelectorAll("[data-highlight-id]");
		for (const el of existingHighlights) {
			const parent = el.parentNode;
			if (parent) {
				const textNode = document.createTextNode(el.textContent || "");
				parent.replaceChild(textNode, el);
				parent.normalize();
			}
		}
	}

	// Public API
	async initializeForUrl(url: string) {
		const { getPostByUrl } = await import("@/apis/fetcher");
		const post = await getPostByUrl(url);

		if (!post) {
			this.state = {
				postId: null,
				highlights: [],
				lastSyncTimestamp: Date.now(),
			};
			return;
		}

		const highlights = await getAllHighlightsByPostId(post.id);
		this.state = {
			postId: post.id,
			highlights,
			lastSyncTimestamp: Date.now(),
		};
		this.paintHighlights(highlights);
	}

	setPostId(postId: string | null) {
		this.state = { ...this.state, postId };
	}
}

export const highlightSyncStore = new HighlightSyncStore();
