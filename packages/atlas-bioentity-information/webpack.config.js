const path = require(`path`)
const CleanWebpackPlugin = require(`clean-webpack-plugin`)

const vendorsBundleName = `vendors`
const commonPublicPath = `/dist/`

module.exports = {
  entry: {
    bioentityDemo: [`@babel/polyfill`, `./html/Demo.js`],
  },

  output: {
    library: `[name]`,
    filename: `[name].bundle.js`,
    publicPath: commonPublicPath
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
          chunks: `all`
        }
      }
    }
  },

  plugins: [
    new CleanWebpackPlugin([`dist`])
  ],

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
