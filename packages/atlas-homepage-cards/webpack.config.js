const CleanWebpackPlugin = require(`clean-webpack-plugin`)
const path = require(`path`)

const commonPublicPath = `/dist/`

module.exports = {
  entry: {
    homepageCardsDemo: [`babel-polyfill`, `./html/render.js`]
  },

  plugins: [
    new CleanWebpackPlugin([`dist`])
  ],

  output: {
    library: `[name]`,
    path: path.resolve(__dirname, `dist`),
    filename: `[name].bundle.js`,
    publicPath: `/html/`
  },

  optimization: {
    splitChunks: {
      chunks: `all`,
      minSize: 1,
      cacheGroups: {
        homepageCards: {
          test: /[\\/]src[\\/]/,
          name: `homepageCards`,
          priority: -20
        },
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          name: `vendors`,
          priority: -10
        }
      }
    }
  },

  module: {
    rules: [
      {
        test: /\.js$/i,
        exclude: /node_modules\//,
        use: `babel-loader`
      }
    ]
  },

  devServer: {
    port: 9000,
    contentBase: path.resolve(__dirname, `html`),
    publicPath: commonPublicPath
  }
}
