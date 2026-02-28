/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary-black': '#0F0F0F',
        'secondary-gold': '#D4AF37',
        'accent-beige': '#F5F1E8',
      },
      fontFamily: {
        'serif-display': ['Playfair Display', 'serif'],
        'sans-body': ['Poppins', 'sans-serif'],
      },
    },
  },
  plugins: [],
}