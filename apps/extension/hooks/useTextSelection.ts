import { useCallback, useLayoutEffect, useState } from "react";

type ClientRect = Record<keyof Omit<DOMRect, "toJSON">, number>;

function roundValues(_rect: ClientRect) {
	const rect = { ..._rect };
	for (const key of Object.keys(rect)) {
		// @ts-expect-error type casting issue
		rect[key] = Math.round(rect[key]);
	}
	return rect;
}

function shallowDiff(prev: any, next: any) {
	if (prev != null && next != null) {
		for (const key of Object.keys(next)) {
			if (prev[key] !== next[key]) {
				return true;
			}
		}
	} else if (prev !== next) {
		return true;
	}
	return false;
}

type TextSelectionState = {
	clientRect?: ClientRect;
	isCollapsed?: boolean;
	textContent?: string;
	range?: Range;
};

const defaultState: TextSelectionState = {};

export function useTextSelection(target?: HTMLElement) {
	const [{ clientRect, isCollapsed, textContent, range }, setState] =
		useState<TextSelectionState>(defaultState);

	const handler = useCallback(() => {
		const selection = window.getSelection();

		if (selection == null || !selection.rangeCount) {
			setState(defaultState);
			return;
		}

		const range = selection.getRangeAt(0);

		if (target != null && !target.contains(range.commonAncestorContainer)) {
			setState(defaultState);
			return;
		}

		if (range == null) {
			setState(defaultState);
			return;
		}

		const newTextContent = range.toString();
		let newRect: ClientRect | undefined;

		const rects = range.getClientRects();
		if (rects.length === 0 && range.commonAncestorContainer != null) {
			const el = range.commonAncestorContainer as HTMLElement;
			newRect = roundValues(el.getBoundingClientRect().toJSON());
		} else {
			if (rects.length > 0) {
				newRect = roundValues(rects[0].toJSON());
			}
		}

		setState((prevState) => {
			const rectChanged =
				newRect && prevState.clientRect
					? shallowDiff(prevState.clientRect, newRect)
					: newRect !== prevState.clientRect;

			const textChanged = prevState.textContent !== newTextContent;
			const collapsedChanged = prevState.isCollapsed !== range.collapsed;

			if (!rectChanged && !textChanged && !collapsedChanged) {
				return prevState;
			}

			return {
				range,
				clientRect: newRect,
				textContent: newTextContent,
				isCollapsed: range.collapsed,
			};
		});
	}, [target]);

	useLayoutEffect(() => {
		document.addEventListener("selectionchange", handler);
		document.addEventListener("keydown", handler);
		document.addEventListener("keyup", handler);
		window.addEventListener("resize", handler);

		return () => {
			document.removeEventListener("selectionchange", handler);
			document.removeEventListener("keydown", handler);
			document.removeEventListener("keyup", handler);
			window.removeEventListener("resize", handler);
		};
	}, [handler]);

	return {
		clientRect,
		isCollapsed,
		textContent,
		range,
	};
}
