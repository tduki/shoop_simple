/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      animation: {
        'blink': 'blink 1s steps(1) infinite',
        'typing': 'typing 3.5s steps(40, end)',
        'cursor-blink': 'blink 1s step-end infinite',
        'glow': 'glow 2s ease-in-out infinite',
        'slide-in': 'slideIn 0.5s ease-out forwards',
        'float': 'float 3s ease-in-out infinite',
        'fadeIn': 'fadeIn 1s ease-out forwards',
      },
      keyframes: {
        typing: {
          'from': { width: '0' },
          'to': { width: '100%' }
        },
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' }
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' }
        },
        fadeIn: {
          'from': { opacity: '0' },
          'to': { opacity: '1' }
        }
      }
    },
  },
  plugins: [],
} 