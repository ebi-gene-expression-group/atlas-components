var webpack = require('webpack');
var path = require('path');
var CleanWebpackPlugin = require('clean-webpack-plugin');

// If you get the message “loaderUtils.parseQuery() received a non-string value...” uncomment next line
// process.traceDeprecation = true;

module.exports = {
    entry: {
        myPackage: './html/render.js',
        dependencies: ['prop-types', 'react', 'react-dom', 'urijs']
    },

    output: {
        library: '[name]',
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].bundle.js',
        publicPath: '/html/'
    },

    plugins: [
        new CleanWebpackPlugin(['dist'], {verbose: true, dry: false}),
        new webpack.optimize.CommonsChunkPlugin({
            name: 'dependencies',
            filename: 'vendorCommons.bundle.js',
            minChunks: Infinity     // Explicit definition-based split, see dependencies entry
        }),
        new webpack.DefinePlugin({
            "process.env": {
                NODE_ENV: process.env.NODE_ENV === 'production' ?
                          JSON.stringify("production") : JSON.stringify("development")
          }
        })
    ],

    module: {
        rules: [
            {
                test: /\.css$/i,
                use: [ 'style-loader', 'css-loader' ]
            },
            {
                test: /\.less$/i,
                use: [ 'style-loader', 'css-loader', 'less-loader' ]
            },
            {
                test: /\.(jpe?g|png|gif)$/i,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            query: {
                                name: '[hash].[ext]',
                                hash: 'sha512',
                                digest: 'hex'
                            }
                        }
                    },
                    {
                        loader: 'image-webpack-loader',
                        options: {
                            query: {
                                bypassOnDebug: true,
                                mozjpeg: {
                                    progressive: true,
                                },
                                gifsicle: {
                                    interlaced: true,
                                },
                                optipng: {
                                    optimizationLevel: 7,
                                }
                            }
                        }
                    }
                ]
            },
            {
                test: /\.svg$/i,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            query: {
                                name: '[hash].[ext]',
                                hash: 'sha512',
                                digest: 'hex'
                            }
                        }
                    }
                ]
            },
            {
                test: /\.js$/i,
                exclude: /node_modules\//,
                use: 'babel-loader'
            }
        ]
    },

    devServer: {
        port: 9000
    }
};
