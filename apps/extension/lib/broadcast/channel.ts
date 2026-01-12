export const CHANNEL_NAME = "hanspoon-highlights";

export type HighlightSyncMessage =
	| {
			type: "HIGHLIGHT_ADDED";
			id: string;
			postId: string;
			timestamp: number;
	  }
	| { type: "HIGHLIGHT_DELETED"; id: string; timestamp: number }
	| { type: "POST_ADDED"; postId: string; timestamp: number }
	| { type: "POST_DELETED"; postId: string; timestamp: number };

class HighlightBroadcastChannel {
	private channel: BroadcastChannel;

	constructor() {
		this.channel = new BroadcastChannel(CHANNEL_NAME);
	}

	postMessage(message: HighlightSyncMessage) {
		this.channel.postMessage(message);
	}

	addEventListener(callback: (message: HighlightSyncMessage) => void) {
		const handler = (event: MessageEvent<HighlightSyncMessage>) => {
			callback(event.data);
		};

		this.channel.addEventListener("message", handler);

		return () => {
			this.channel.removeEventListener("message", handler);
		};
	}

	close() {
		this.channel.close();
	}
}

let broadcastChannel: HighlightBroadcastChannel | null = null;

export const getBroadcastChannel = (): HighlightBroadcastChannel => {
	if (!broadcastChannel) {
		broadcastChannel = new HighlightBroadcastChannel();
	}
	return broadcastChannel;
};
