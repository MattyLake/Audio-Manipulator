const path = require('path');

module.exports = {
    entry: {
        main: './src/index.js',
    },
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist', 'static', 'scripts'), // Output directory
    },
    module: {
        rules: [
            {
                test: /\.js$/, // Transpile JS files
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader', // Optional: if using Babel
                    options: {
                        presets: ['@babel/preset-env'],
                    },
                },
            },
            // Add loaders for CSS, images, etc. as needed
        ],
    },
    devtool: 'source-map', // Helpful for debugging
    mode: 'development', // Change to 'production' for production builds
    // mode: 'production',
    watch: true, // Enable watch mode
};