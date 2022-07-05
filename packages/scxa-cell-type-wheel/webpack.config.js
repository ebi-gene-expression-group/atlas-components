const path = require(`path`)

module.exports = {
  entry: {
    cellTypeWheelDemo: [`./html/render.js`],
  },

  output: {
    library: `[name]`,
    filename: `[name].bundle.js`,
    devtoolNamespace: `webpack`,
    clean:true
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
