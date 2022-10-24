const path = require(`path`)

const vendorsBundleName = `vendors`
const commonPublicPath = `/dist/`

module.exports = {
  entry: {
    CellTypeWheelExperimentHeatmapDemo: `./html/Demo.js`
  },

  output: {
    library: `[name]`,
    filename: `[name].bundle.js`,
    devtoolNamespace: `webpack`,
    clean: true
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
    static: `./html`,
    devMiddleware: {
      publicPath: `/dist`
    }
    // Add if developing a SPA to redirect non-matching routes known by WDS (i.e. no document in /html) to the router
    // historyApiFallback: true
  }
}

