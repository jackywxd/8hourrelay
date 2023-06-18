import nextMDX from "@next/mdx";
import remarkGfm from "remark-gfm";
import rehypePrism from "@mapbox/rehype-prism";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

const nextConfig = {
  trailingSlash: true,
  pageExtensions: ["ts", "tsx", "js", "jsx", "mdx"],
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
  // i18n: {
  //   locales: ["en", "zh", "zh-TW"],
  //   defaultLocale: "en",
  // },
  transpilePackages: [
    "ui",
    "@8hourrelay/store",
    "@material-tailwind",
    "react-native-async-storage",
    "react-native-safe-area-context",
    "react-native-paper",
    "react-native-vector-icons",
    "react-native-gesture-handler",
    "react-native-reanimated",
    "react-native-screens",
    "react-native-status-bar-height",
    "@react-navigation/native",
    "@react-navigation/stack",
  ],
  reactStrictMode: true,
  webpack: (config) => {
    // console.log(config);
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      // Transform all direct `react-native` imports to `react-native-web`
      "react-native$": "react-native-web",
      "react-native-vector-icons/MaterialCommunityIcons":
        "react-native-vector-icons/dist/MaterialCommunityIcons",
    };
    config.resolve.extensions = [
      ".web.js",
      ".web.jsx",
      ".web.ts",
      ".web.tsx",
      ...config.resolve.extensions,
    ];

    config.module.rules.push({
      test: /\.ttf$/,
      loader: "url-loader", // or directly file-loader
      include: [
        // as reported by the error, imported from monorepo shared code package
        path.resolve(
          __dirname,
          ".",
          "node_modules",
          "react-native-vector-icons"
        ), // from this package
      ],
    });
    return config;
  },
  images: {
    domains: ["localhost"],
    deviceSizes: [
      400, 600, 800, 1000, 1200, 1400, 1600, 1800, 2000, 2200, 2400, 2600, 2800,
      3000, 3200, 3400,
    ],
    imageSizes: [
      20, 30, 40, 50, 60, 80, 100, 120, 140, 180, 220, 260, 300, 340, 380, 390,
    ],
  },
};

export default nextMDX({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [rehypePrism],
  },
})(nextConfig);
