module.exports = {
  plugins: {
    '@tailwindcss/postcss': {
      // This is where Tailwind now gets its content paths from.
      // This must be accurate for your styles to be built correctly.
      content: [
        './src/index.html',
        './src/**/*.js',
      ],
    },
    autoprefixer: {},
  },
};
