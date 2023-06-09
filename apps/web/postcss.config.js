const path = require("path");

module.exports = {
  plugins: {
    tailwindcss: {
      config: path.join(__dirname, "tailwind.config.js"),
    },
    "postcss-focus-visible": {
      replaceWith: "[data-focus-visible-added]",
    },
    autoprefixer: {},
  },
};
