import React, { useEffect } from "react";
import { useRecoilState } from "recoil";

import { State, Theme } from "../builder";

/**
 * A React component that listens for changes to the "prefers-color-scheme"
 * CSS media query and updates the body and meta "theme-color" whenever it changes.
 *
 * @param state The state object to use.
 * @param applyTheme An alternative function to be called when applying a theme.
 */
export function ThemeProvider<T extends Theme = Theme>({
	state,
	applyTheme,
}: {
	state: State<T>;
	applyTheme?: (theme: T) => void;
}) {
	const [theme, setTheme] = useRecoilState(state);
	const current: T | undefined = theme.override ?? theme.current;

	// Initialize the media query matcher.
	//
	// This will set the current theme (not override) and listen for changes to
	// the prefers-color-scheme media query.
	useEffect(() => {
		const matcher = window.matchMedia("(prefers-color-scheme: dark)");

		function updateTheme() {
			setTheme({
				...theme,
				current: matcher.matches ? ("dark" as T) : ("light" as T),
			});
		}

		// If the current theme is null, set it.
		if (current == null) {
			updateTheme();
		}

		// Add an event listener for the matcher.
		matcher.addEventListener("change", updateTheme);
		return () => {
			matcher.removeEventListener("change", updateTheme);
		};
	});

	// Handle theme changes.
	//
	// If an applyTheme function was provided, use that.
	// Otherwise, use the default behaviour of setting an attribute and the meta tag.
	const last = theme.previous;
	useEffect(() => {
		if (current === last) return;
		if (applyTheme != null) {
			applyTheme(current!);
			return;
		}

		// Update the "data-theme" attribute on the body.
		document.body.setAttribute("data-theme", current as string);

		// Update the "theme-color" meta tag to the same colour as the body brackground.
		const metaTheme = document.querySelector('meta[name="theme-color"]');
		if (metaTheme != null) {
			const bodyStyle = window.getComputedStyle(document.body);
			metaTheme.setAttribute("content", bodyStyle.backgroundColor);
		}
	}, [applyTheme, current, last]);

	// Return an empty fragment as a placeholder.
	return React.createElement(React.Fragment);
}
