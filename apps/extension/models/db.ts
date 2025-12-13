import Dexie, { type Table } from "dexie";
import type { SerializedHighlight } from "../lib/highlight/types";

export interface Highlight extends SerializedHighlight {}

export class HighlightDB extends Dexie {
	highlights!: Table<Highlight, string>;

	constructor() {
		super("HanspoonHighlightDB");

		this.version(1).stores({
			highlights: "id, text",
		});
	}
}

export const db = new HighlightDB();
