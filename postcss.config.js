module.exports = {
  plugins: {
    '@tailwindcss/postcss': {
      // This is where Tailwind now gets its content paths from.
      // This must be accurate for your styles to be built correctly.
      content: [
        './dist/views/index.html',
        './src/**/*.js',
      ],
    },
    autoprefixer: {},
  },
};
