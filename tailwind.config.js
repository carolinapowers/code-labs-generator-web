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
        // Pluralsight Design System - using CSS variables for theme switching
        'bg-primary': 'var(--bg-primary)',
        'bg-secondary': 'var(--bg-secondary)',
        'bg-tertiary': 'var(--bg-tertiary)',
        'bg-sidebar': 'var(--bg-sidebar)',
        'bg-card': 'var(--bg-card)',

        'text-primary': 'var(--text-primary)',
        'text-secondary': 'var(--text-secondary)',
        'text-tertiary': 'var(--text-tertiary)',
        'text-muted': 'var(--text-muted)',
        'text-link': 'var(--text-link)',

        'border-default': 'var(--border-default)',
        'border-active': 'var(--border-active)',
        'border-subtle': 'var(--border-subtle)',

        'accent-primary': 'var(--accent-primary)',
        'accent-orange': 'var(--accent-orange)',
        'accent-hover': 'var(--accent-hover)',

        // Legacy Pluralsight colors (keep for backwards compatibility)
        'ps-orange': '#E77B33',
        'ps-success': '#6AC56F',
        'ps-warning': '#FFB900',
        'ps-error': '#E85D5D',
        'ps-info': '#0066CC',
      },
      backgroundColor: {
        'status-success': 'var(--status-success-bg)',
        'status-error': 'var(--status-error-bg)',
        'status-warning': 'var(--status-warning-bg)',
        'status-info': 'var(--status-info-bg)',
      },
      textColor: {
        'status-success': 'var(--status-success-text)',
        'status-error': 'var(--status-error-text)',
        'status-warning': 'var(--status-warning-text)',
        'status-info': 'var(--status-info-text)',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}
