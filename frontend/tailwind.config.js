/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        surface: "#12121a",
        subtle: "rgba(255, 255, 255, 0.08)",
        muted: "#9a98a6",
      },
    },
  },
  plugins: [],
}
