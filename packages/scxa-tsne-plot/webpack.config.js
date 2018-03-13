const webpack = require(`webpack`)
const path = require(`path`)
const CleanWebpackPlugin = require(`clean-webpack-plugin`)
const ExtractTextPlugin = require("extract-text-webpack-plugin");

// If you get the message “loaderUtils.parseQuery() received a non-string value...” uncomment next line
// process.traceDeprecation = true;

config = {
    entry: {
        demo: [`babel-polyfill`, `./html/Demo.js`],
        dependencies: [`prop-types`, `react`, `react-dom`, `urijs`]
    },

    output: {
        library: `[name]`,
        path: path.resolve(__dirname, `dist`),
        filename: `[name].bundle.js`,
        publicPath: `/html/`
    },

    plugins: [
        new CleanWebpackPlugin([`dist`], {verbose: true, dry: false}),
        new ExtractTextPlugin(`styles.css`),
        new webpack.optimize.CommonsChunkPlugin({
            name: `dependencies`,
            filename: `vendorCommons.bundle.js`,
            minChunks: Infinity     // Explicit definition-based split, see dependencies entry
        })
    ],

    module: {
        rules: [
            {
                test: /\.css$/i,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: [{
                        loader: 'css-loader',
                        options: {
                            modules: true,
                            localIdentName: '[name]__[local]___[hash:base64:5]'
                        }
                    }]
                })
            },
            {
                test: /\.less$/i,
                use: [ `style-loader`, `css-loader`, `less-loader` ]
            },
            {
                test: /\.(jpe?g|png|gif)$/i,
                use: [
                    {
                        loader: `file-loader`,
                        options: {
                            query: {
                                name: `[hash].[ext]`,
                                hash: `sha512`,
                                digest: `hex`
                            }
                        }
                    },
                    {
                        loader: `image-webpack-loader`,
                        options: {
                            query: {
                                bypassOnDebug: true,
                                mozjpeg: {
                                    progressive: true
                                },
                                gifsicle: {
                                    interlaced: true
                                },
                                optipng: {
                                    optimizationLevel: 7
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
                        loader: `file-loader`,
                        options: {
                            query: {
                                name: `[hash].[ext]`,
                                hash: `sha512`,
                                digest: `hex`
                            }
                        }
                    }
                ]
            },
            {
                test: /\.js$/i,
                exclude: /node_modules\//,
                use: `babel-loader`
            }
        ]
    },

    devServer: {
        port: 9000
    }
}

module.exports = config
