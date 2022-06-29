const path = require(`path`)

module.exports = {
  entry: {
    heatmapViewRenderModule: `./html/heatmapViewRenderModule.js`,
    markerGeneHeatmapRenderModule: `./html/markerGeneHeatmapRenderModule.js`,
    clustersViewDemo: `./html/ClustersViewDemo.js`
  },

  output: {
    library: `[name]`,
    filename: `[name].bundle.js`,
    clean: true
  },

  resolve: {
    // These aliases are helpful if you integrate other components which use React
    alias: {
      "react": path.resolve(`./node_modules/react`),
      "react-dom": path.resolve(`./node_modules/react-dom`)
    },
  },

  optimization: {
    splitChunks: {
      cacheGroups: {
        commons: {
          test: /[\\/]node_modules[\\/]/,
          name: `vendors`,
          chunks: `all`
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
