const path = require("path");
const { fontFamily } = require("tailwindcss/defaultTheme");
const withMT = require("@material-tailwind/react/utils/withMT");

/** @type {import('tailwindcss').Config} */
module.exports = withMT({
  darkMode: ["class", '[data-theme="coffee"]'],
  daisyui: {
    themes: [
      {
        mytheme: {
          primary: "#DB924B",
          secondary: "#263E3F",
          accent: "#10576D",
          neutral: "#120C12",
          "base-100": "#20161F",
          info: "#8DCAC1",
          success: "#9DB787",
          warning: "#FFD25F",
          error: "#FC9581",
        },
      },
      "coffee",
    ],
  },
  content: [
    path.join(__dirname, "./pages/**/*.{js,ts,jsx,tsx}"),
    path.join(__dirname, "./src/**/*.{js,ts,jsx,tsx,mdx}"),
    "./src/components/**/*.{ts,tsx}",
    "./src/pages/**/*.{ts,tsx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "../../node_modules/@material-tailwind/react/components/**/*.{js,ts,jsx,tsx}",
    "../../node_modules/@material-tailwind/react/theme/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)", ...fontFamily.sans],
      },
    },
  },
  plugins: [require("@tailwindcss/typography"), require("daisyui")],
});
