import { RecoilState, atom } from "recoil";
import { useRecoilState } from "recoil";

export { ThemeProvider } from "./components/ThemeProvider";

/**
 * Default types of themes available.
 */
export type Theme = "dark" | "light";

/**
 * An alias for the {@link RecoilState} for "react-theme-utils".
 */
export type State<T extends Theme = Theme> = RecoilState<StateData<T>>;

type StateData<T extends Theme> = {
	override: T | null;
	current: T | undefined;
	previous: T | undefined;
};

/**
 * Creates a new theme {@link State}.
 *
 * @param key The Recoil state key.
 * @returns The Recoil state.
 */
export function createState<T extends Theme = Theme>(key: string): State<T> {
	return atom({
		key,
		default: {
			override: localStorage.getItem(key),
			current: undefined,
			previous: undefined,
		} as StateData<T>,
	});
}

/**
 * Changes the website theme permanently.
 * This will disable automatic theming unless reset by providing {@code null} as a theme.
 *
 * @param theme The theme to set.
 */
export type useThemeSetter<T extends Theme = Theme> = (theme: T | null) => void;

/**
 * Returns a tuple of the current theme and a function to change the theme.
 * THIS IS A HOOK, and must be called from within a component.
 */
export type useTheme<T extends Theme = Theme> = () => [T, useThemeSetter<T>];

/**
 * Creates the utility functions for the given state.
 *
 * @param state The state.
 * @returns The utility functions.
 */
export function createUtilities<T extends Theme = Theme>(
	state: State<T>
): {
	useTheme: useTheme<T>;
} {
	function useTheme(): [T, useThemeSetter<T>] {
		const [themeState, setTheme] = useRecoilState(state);
		const effectiveTheme = themeState.override ?? themeState.current ?? ("light" as T);
		return [
			effectiveTheme,
			(theme: T | null) => {
				if (theme == null) {
					localStorage.removeItem(state.key);
				} else {
					localStorage.setItem(state.key, theme);
				}

				setTheme({
					...themeState,
					override: theme,
				});
			},
		];
	}

	return { useTheme };
}
