const path = require("path");
const nodeExternals = require("webpack-node-externals");

module.exports = {
  target: "node",
  mode: "production",
  entry: "./src/index.ts",
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  optimization: {
    minimize: false,
  },
  performance: {
    hints: false,
  },
  devtool: "nosources-source-map",
  resolve: {
    extensions: [".tsx", ".ts", ".js", ".json"],
  },
  externals: [
    /^firebase.+$/,
    /^@google.+$/,
    nodeExternals({
      allowlist: [/^@8hourrelay/],
    }),
    nodeExternals({
      modulesDir: path.resolve(__dirname, "../../node_modules"),
      allowlist: [/^@8hourrelay/],
    }),
  ],
  output: {
    filename: "index.js",
    path: path.resolve(__dirname, "../functions/dist"),
    libraryTarget: "commonjs",
  },
};
