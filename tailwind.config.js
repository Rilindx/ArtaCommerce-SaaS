export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f6f7f2',
          100: '#e7ead7',
          200: '#d5dcba',
          300: '#beca95',
          400: '#aab673',
          500: '#8f9953',
          600: '#747d42',
          700: '#5b6235',
          800: '#4a502d',
          900: '#3f4429'
        }
      },
      boxShadow: {
        panel: '0 12px 40px rgba(15, 23, 42, 0.18)'
      },
      backgroundImage: {
        'hero-grid':
          'radial-gradient(circle at top, rgba(190,202,149,0.22), transparent 38%), linear-gradient(135deg, rgba(15,23,42,1), rgba(15,23,42,0.94))'
      }
    }
  },
  plugins: []
};
