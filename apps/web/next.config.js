module.exports = {
  distDir: "build",
  // i18n: {
  //   locales: ["en", "zh", "zh-TW"],
  //   defaultLocale: "en",
  // },
  transpilePackages: [
    "ui",
    "@8hourrelay/login",
    "@8hourrelay/store",
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
    config.module.rules.push({
      test: /\.(woff|woff2|ttf|eot|svg)$/,
      loader: "file-loader",
      options: {
        esModule: false,
        name: "[name].[ext]",
        outputPath: "static/media/fonts/",
        publicPath: "../assets/fonts/",
      },
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
