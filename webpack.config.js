var path = require('path');
var webpack = require("webpack");

module.exports = {
    // Target the output of the typescript compiler
    context: path.join(__dirname, "test"),

    // File(s) to target
    entry: './index.ts',

    // Output
    output: {
        filename: 'demo.js',
        path: path.resolve(__dirname, 'dist')
    },

    // Resolve the file extensions
    resolve: {
        extensions: [".js", ".jsx", ".ts", ".tsx"]
    },

    // Module to define what libraries with the compiler
    module: {
        // Loaders
        loaders: [
            {
                // Target the sass files
                test: /\.scss?$/,
                // Define the compiler to use
                use: [
                    // Create style nodes from the CommonJS code
                    { loader: "style-loader" },
                    // Translate css to CommonJS
                    { loader: "css-loader" },
                    // Compile sass to css
                    { loader: "sass-loader" }
                ]
            },
            {
                // Target the typescript files
                test: /\.tsx?$/,
                // Exclude the npm libraries
                exclude: /node_modules/,
                // Define the compiler to use
                use: [
                    {
                        // Use the "babel-loader" library
                        loader: "babel-loader",
                        // Options
                        options: {
                            // Use the 'babel-preset-es2015' library
                            presets: ["es2015"]
                        }
                    },
                    {
                        // Use the "ts-loader" library
                        loader: "ts-loader"
                    }
                ]
            }
        ]
    }
};