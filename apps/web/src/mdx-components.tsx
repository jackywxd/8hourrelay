import type { MDXComponents } from "mdx/types";

// This file allows you to provide custom React components
// to be used in MDX files. You can import and use any
// React component you want, including components from
// other libraries.

// This file is required to use MDX in `app` directory.
export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    // Allows customizing built-in components, e.g. to add styling.
    h1: ({ children }) => <h1 className="text-brown-300">{children}</h1>,
    h2: ({ children }) => <h1 className="text-brown-200">{children}</h1>,
    p: ({ children }) => <p className="text-brown-100">{children}</p>,
    ...components,
  };
}
