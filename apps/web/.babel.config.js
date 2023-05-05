module.exports = {
  presets: ["next/babel"],
  plugins: [
    ["react-native-web"],
    ["@babel/plugin-proposal-decorators", { version: "legacy" }],
    // MobX 5/6
    ["@babel/plugin-proposal-class-properties"],
  ],
};
