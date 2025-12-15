import type { SerializedHighlight } from "../lib/highlight/types";
import { db } from "../models/db";

export const saveHighlight = async (data: SerializedHighlight) => {
	await db.highlights.add(data);
};

export const deleteHighlight = async (id: string) => {
	await db.highlights.delete(id);
};

export const getAllHighlights = () => {
	return db.highlights.toArray();
};
