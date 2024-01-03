/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      fontFamily: {
        robooooto: "Robotooo",
        insta: "insta",
      },
      spacing: {
        112: "30rem",
        128: "32rem",
      },
      aspectRatio: {
        story: "9/16",
        portrait: "4/5",
        instaPost: "3.5/4",
      },
    },
  },
  darkMode: "class",
  plugins: [],
};
