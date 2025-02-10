module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        fadeIn: {
          'from': { 
            opacity: '0', 
            transform: 'translateY(10px)' 
          },
          'to': { 
            opacity: '1', 
            transform: 'translateY(0)' 
          }
        },
        spin: {
          'to': { 
            transform: 'rotate(360deg)' 
          }
        }
      },
      animation: {
        'fadeIn': 'fadeIn 0.3s ease-out forwards',
        'spin': 'spin 1s linear infinite'
      },
      colors: {
        'indigo-start': '#4F46E5',
        'purple-mid': '#7C3AED',
        'pink-end': '#EC4899',
      },
      backgroundImage: {
        'gradient-custom': 'linear-gradient(135deg, var(--tw-gradient-stops))',
      }
    },
  },
  plugins: [],
}