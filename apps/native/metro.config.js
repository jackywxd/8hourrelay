// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require("expo/metro-config");
const path = require("path");
const {
  getMetroTools,
  getMetroAndroidAssetsResolutionFix,
} = require("react-native-monorepo-tools");

// Find the workspace root, this can be replaced with `find-yarn-workspace-root`
const workspaceRoot = path.resolve(__dirname, "../..");
const projectRoot = __dirname;

const monorepoMetroTools = getMetroTools();
const androidAssetsResolutionFix = getMetroAndroidAssetsResolutionFix({
  depth: 3,
});

const config = getDefaultConfig(projectRoot);

// 1. Watch all files within the monorepo
config.watchFolders = [workspaceRoot, ...monorepoMetroTools.watchFolders];
// 2. Let Metro know where to resolve packages, and in what order
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, "node_modules"),
  path.resolve(workspaceRoot, "node_modules"),
];
// 3. Force Metro to resolve (sub)dependencies only from the `nodeModulesPaths`
config.resolver.disableHierarchicalLookup = true;

config.resolver.extraNodeModules = monorepoMetroTools.extraNodeModules;
config.transformer = {
  publicPath: androidAssetsResolutionFix.publicPath,
  getTransformOptions: async () => ({
    transform: {
      experimentalImportSupport: false,
      inlineRequires: false,
    },
  }),
};
config.server = {
  // ...and to the server middleware.
  enhanceMiddleware: (middleware) => {
    return androidAssetsResolutionFix.applyMiddleware(middleware);
  },
};

// Let Metro know from where it should serve the node_modules assets
// config.server = {
//   enhanceMiddleware: (middleware) => {
//     return (req, res, next) => {
//       const assets = "/node_modules/";

//       if (req.url.startsWith(assets)) {
//         req.url = req.url.replace(assets, "/assets/../../node_modules/");
//       }

//       return middleware(req, res, next);
//     };
//   },
// };

module.exports = config;
