const { CleanWebpackPlugin } = require(`clean-webpack-plugin`)
const path = require(`path`)

const commonPublicPath = `/dist/`

module.exports = {
  entry: {
    markerGeneHeatmapDemo: [`@babel/polyfill`, `./html/DemoCellTypeHeatmap.js`],
  },

  plugins: [
    new CleanWebpackPlugin()
  ],

  output: {
    library: `[name]`,
    filename: `[name].bundle.js`,
    publicPath: commonPublicPath,
    devtoolNamespace: `firefox`
  },

  optimization: {
    splitChunks: {
      chunks: `all`,
      minSize: 1,
      cacheGroups: {
        markerGeneHeatmap: {
          test: /[\\/]src[\\/]/,
          name: `markerGeneHeatmap`,
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
      }
    ]
  },

  devServer: {
    port: 9000,
    contentBase: path.resolve(__dirname, `html`),
    publicPath: commonPublicPath
  }
}
