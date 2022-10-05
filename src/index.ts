import { Theme, createState, createUtilities } from "./builder";
import { ThemeProvider as ThemeProviderComponent } from "./components/ThemeProvider";

export type { Theme } from "./builder";
export const state = createState<Theme>("theme");
export const { useTheme } = createUtilities<Theme>(state);

/**
 * A React component that listens for changes to the "prefers-color-scheme"
 * CSS media query and updates the body and meta "theme-color" whenever it changes.
 *
 * @param applyTheme An alternative function to be called when applying a theme.
 */
export const ThemeProvider = (options: Omit<Parameters<typeof ThemeProviderComponent>[0], "state">) => {
	return ThemeProviderComponent<Theme>({
		...options,
		state,
	});
};
