/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#C8102E',
        'primary-hover': '#A00D25',
        'gov-blue': '#003366',
        'main-black': '#000000',
        'off-white': '#F5F5F5',
        'dark-grey': '#212121',
      },
      borderRadius: {
        'none': '0',
        'sm': '2px',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        heading: ['Barlow Condensed', 'sans-serif'],
      },
      boxShadow: {
        'official': '0 2px 4px 0 rgba(0, 0, 0, 0.1)',
      }
    },
  },
  plugins: [],
}