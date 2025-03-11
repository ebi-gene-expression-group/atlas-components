const path = require(`path`)
const { CleanWebpackPlugin } = require(`clean-webpack-plugin`)

const vendorsBundleName = `vendors`
const commonPublicPath = `/dist/`

module.exports = {
  entry: {
    bioentityDemo: [`@babel/polyfill`, `./html/Demo.js`],
  },

  output: {
    library: `[name]`,
    filename: `[name].bundle.js`,
    publicPath: commonPublicPath,
    devtoolNamespace: `firefox`
  },

  resolve: {
    alias: {
      "react": path.resolve(`./node_modules/react`),
      "react-dom": path.resolve(`./node_modules/react-dom`),
      "styled-components": path.resolve(`./node_modules/styled-components`)
    },
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
    new CleanWebpackPlugin()
  ],

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
    static: path.resolve(__dirname, 'html'),
    devMiddleware: {
      publicPath: commonPublicPath,
    },
  }
}
