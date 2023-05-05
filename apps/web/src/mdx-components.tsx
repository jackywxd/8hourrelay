import type { MDXComponents } from "mdx/types";
import { useTheme } from "react-native-paper";

// This file allows you to provide custom React components
// to be used in MDX files. You can import and use any
// React component you want, including components from
// other libraries.

// This file is required to use MDX in `app` directory.
export function useMDXComponents(components: MDXComponents): MDXComponents {
  const { colors } = useTheme();
  return {
    // Allows customizing built-in components, e.g. to add styling.
    h1: ({ children }) => (
      <h1 style={{ color: colors.onSurface, fontSize: "2rem" }}>{children}</h1>
    ),
    h2: ({ children }) => (
      <h1 style={{ color: colors.onSurface, fontSize: "1rem" }}>{children}</h1>
    ),
    ...components,
  };
}
