# @sfusurge/react-theme-utils

<img src=".github/assets/surge.svg" alt="SFU Surge Logo" />

Utilities for theming React websites.

## Features

-   Automatically detect and listen for `prefers-color-scheme`.
-   Automatically change the `<meta name="theme-color">` tag.
-   Sets a `data-theme="dark|light"` attribute on the `body` tag.

## Usage

Under your `<RecoilRoot>`, add the `<ThemeProvider>` component.

```tsx
function App() {
	return (
		<RecoilRoot>
			<ThemeProvider /> {/* <-- adds theme support */}
			...
		</RecoilRoot>
	);
}
```

## Requirements

This requires the following packages:

-   React
-   Recoil

## Contributing

To release a new version, create and push a new tag in the format of `v1.2.3`. The CI will automatically publish the packages with the version `1.2.3`.
