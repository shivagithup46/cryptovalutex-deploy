/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        vault: {
          900: 'var(--bg-primary)',
          800: 'var(--bg-secondary)',
          700: 'var(--bg-tertiary)',
          600: 'var(--bg-card)',
          500: 'var(--border-color)',
          400: 'var(--bg-hover)',
        },
        accent: {
          purple: 'var(--accent-primary)',
          neonBlue: 'var(--accent-primary)', // Maps legacy class
          electricCyan: 'var(--accent-secondary)', // Maps legacy class
          pink: 'var(--accent-primary)', // Maps legacy class
          primary: 'var(--accent-primary)', 
          secondary: 'var(--accent-secondary)',
        },
        primary: 'var(--text-primary)',
        secondary: 'var(--text-secondary)',
        muted: 'var(--text-muted)'
      },
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
        space: ['Space Grotesk', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'vault-gradient': 'linear-gradient(135deg, var(--bg-primary) 0%, var(--bg-tertiary) 50%, var(--bg-hover) 100%)',
      },
    },
  },
  plugins: [],
}
