module.exports = {
  purge: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    fontFamily: {
      sans: ['"DM Sans"'],
    },
    extend: {
      colors: {
        primary: "#5E48E8",
        secondary: "#489BE8",
        tertiary: "#F3D9DA",
        success: "#31D0AA",
        error: "#E85B81",
        dark: "#0E0E2C",
        text: "#111111",
        accent: "#ECF1F4",
        light: "#FAFCFE",
        subtle: "#8C8CA1",
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [require("@tailwindcss/forms")],
};
