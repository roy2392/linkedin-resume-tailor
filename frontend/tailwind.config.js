/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          'SF Pro Display',
          'ui-sans-serif',
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'sans-serif',
        ],
      },
      colors: {
        primary: {
          DEFAULT: 'var(--primary-color)',
          light: 'var(--primary-light)',
          dark: 'var(--primary-dark)',
          50: '#f5f7ff',
          100: '#ebf0fe',
          200: '#dae3fe',
          300: '#bfc9fd',
          400: '#9ba5fb',
          500: '#787ff6',
          600: '#6057eb',
          700: '#5344d6',
          800: '#4538ab',
          900: '#3b338b',
          950: '#251e54',
        },
        background: {
          start: 'rgba(var(--background-start-rgb), 1)',
          end: 'rgba(var(--background-end-rgb), 0.8)',
        },
        text: {
          primary: 'var(--text-primary)',
          secondary: 'var(--text-secondary)',
          tertiary: 'var(--text-tertiary)',
        },
        glass: {
          background: 'var(--glass-background)',
          border: 'var(--glass-border)',
          'background-subtle': 'var(--glass-background-subtle)',
          'border-subtle': 'var(--glass-border-subtle)',
        },
        btn: {
          'primary-start': 'var(--btn-primary-start)',
          'primary-end': 'var(--btn-primary-end)',
          'hover-start': 'var(--btn-hover-start)',
          'hover-end': 'var(--btn-hover-end)',
        },
        card: {
          background: 'var(--card-background)',
        },
        'glass-highlight': 'rgba(255, 255, 255, 0.05)',
      },
      textColor: {
        primary: 'var(--text-primary)',
        secondary: 'var(--text-secondary)',
        tertiary: 'var(--text-tertiary)',
      },
      backgroundColor: {
        primary: 'var(--primary-color)',
        'primary-light': 'var(--primary-light)',
        'primary-dark': 'var(--primary-dark)',
        glass: 'var(--glass-background)',
        'glass-subtle': 'var(--glass-background-subtle)',
        card: 'var(--card-background)',
      },
      borderColor: {
        glass: 'var(--glass-border)',
        'glass-subtle': 'var(--glass-border-subtle)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'primary-gradient': 'linear-gradient(135deg, var(--btn-primary-start), var(--btn-primary-end))',
        'hover-gradient': 'linear-gradient(135deg, var(--btn-hover-start), var(--btn-hover-end))',
        'theme-toggle-gradient': 'linear-gradient(to right, var(--theme-toggle-from), var(--theme-toggle-to))',
      },
      backdropBlur: {
        xl: '20px',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '200% 0' },
          '100%': { backgroundPosition: '0 0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
      },
      animation: {
        shimmer: 'shimmer 2s infinite linear',
        float: 'float 3s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}; 