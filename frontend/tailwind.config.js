module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx,css}"],
  theme: {
    extend: {
      colors: {
        "color-primary": '#2BA3E4',
        "color-primary-dark": '#0106D1',
        "color-primary-light": '#7CE1EE',
        "color-white": "#FBFBFB",
        "color-grey": "#DFDFDF",
        'color-dark': '#333A40',
        'color-red': '#E70D0F',
        'color-green': '#28AC00'
      },
      extend: {
        transform: {
          'scale-75': 'scale(0.75)',
        },
      },
    },
    container: {
      center: true,
      padding: {
        DEFAULT: '50px',
        md: '100px',
        lg: '150px'
      }
    },
  },
  variants: {
    extend: {
      backgroundColor: ['hover', 'focus'],
      scale: ['active','target'],
    },
  },
  plugins: [],
};
