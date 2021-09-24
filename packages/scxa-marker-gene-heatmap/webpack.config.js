const { CleanWebpackPlugin } = require(`clean-webpack-plugin`)
const path = require(`path`)

const vendorsBundleName = `vendors`

module.exports = {
  entry: {
    heatmapViewRenderModule: [`@babel/polyfill`, `./html/heatmapViewRenderModule.js`],
    markerGeneHeatmapRenderModule: [`@babel/polyfill`, `./html/markerGeneHeatmapRenderModule.js`],
    clustersViewDemo: [`@babel/polyfill`, `./html/ClustersViewDemo.js`]
  },

  plugins: [
    new CleanWebpackPlugin()
  ],


  output: {
    library: `[name]`,
    path: path.resolve(__dirname, `dist`),
    filename: `[name].bundle.js`,
    publicPath: `/html/`,
    devtoolNamespace: `firefox`
  },

  optimization: {
    runtimeChunk: {
      name: vendorsBundleName
    },
    splitChunks: {
      cacheGroups: {
        commons: {
          test: /[\\/]node_modules[\\/]/,
          name: vendorsBundleName,
          chunks: 'all'
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
    publicPath: `/html`
  }
}
