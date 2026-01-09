/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",       // App.tsx / js files
    "./src/**/*.{js,jsx,ts,tsx}",   // src folder ke sab screens / components / navigators
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {},
  },
  plugins: [],
};
