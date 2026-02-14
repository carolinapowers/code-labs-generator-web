/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Pluralsight Pando colors
        'ps-orange': '#E77B33',
        'ps-neutral-900': '#1A1A1A',
        'ps-neutral-100': '#F5F5F5',
        'ps-success': '#6AC56F',
        'ps-warning': '#FFB900',
        'ps-error': '#E85D5D',
        'ps-info': '#0066CC',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}
