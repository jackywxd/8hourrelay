const { withExpo } = require("@expo/next-adapter");
const withImages = require("next-images");

module.exports = withImages({
  transpilePackages: [
    "ui",
    "login",
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
    };
    config.resolve.extensions = [
      ".web.js",
      ".web.jsx",
      ".web.ts",
      ".web.tsx",
      ...config.resolve.extensions,
    ];
    return config;
  },
});
