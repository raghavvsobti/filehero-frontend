import { colors as myColors } from "./constants";

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  purge: {
    safelist: [
      ...myColors.map(
        (color) => `border-[${color?.includes("#") ? color : `#${color}`}]`
      ),
    ],
  },
  theme: {
    fontFamily: {
      merriweather: ["Merriweather", "serif"],
      comfortaa: ["Comfortaa", "serif"],
    },
    extend: {},
  },
  plugins: [],
};
