const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  // Use your existing entry point
  entry: {
    main: './src/index.js',
  },
  
  // Use your existing output configuration
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist', 'static', 'scripts'),
  },
  
  // Modules define how Webpack processes different file types
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
      // This is the new rule for processing CSS files
      {
        test: /\.css$/,
        use: [
          // Extracts CSS into a separate file
          MiniCssExtractPlugin.loader,
          // Interprets @import and url() in CSS
          'css-loader',
          // Processes CSS with plugins like Tailwind and Autoprefixer
          'postcss-loader',
        ],
      },
    ],
  },
  
  // Plugins to extend Webpack's functionality
  plugins: [
    // This plugin extracts CSS from the JS bundle into a separate file
    new MiniCssExtractPlugin({
      // The output filename for the extracted CSS, relative to the output.path
      filename: '../styles/bundle.css',
    }),
  ],

  // devtool: 'source-map', // Helpful for debugging
  // mode: 'development', // Change to 'production' for production builds
  // Use your existing mode and watch settings
  mode: 'production',
  watch: true,
};