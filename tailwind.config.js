/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        automotive: {
          navy: '#0B192C',
          slate: '#1E3E62',
          accent: '#795290', // subtle purple accent
          accentLight: '#F3E8FF',
          accentDark: '#582C6D',
          bg: '#F8FAFC',
          card: '#FFFFFF',
          border: '#E2E8F0',
          warning: '#F59E0B',
          danger: '#EF4444',
          success: '#10B981',
          cyan: '#06B6D4'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace']
      }
    },
  },
  plugins: [],
}
