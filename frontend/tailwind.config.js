/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        purpleText: '#7c3aed', // or any shade of purple you like
      },
    },
  },
  plugins: [],
};
