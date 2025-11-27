// tailwind.config.js

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}", // Isso diz para ele olhar todos os arquivos dentro de /src
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}