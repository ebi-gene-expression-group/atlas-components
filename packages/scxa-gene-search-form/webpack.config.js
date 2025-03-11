const webpack = require('webpack')

const vendorsBundleName = `vendors`

module.exports =  (env) => {
  return {
    entry: {
      geneSearchFormDemo: `./html/render.js`
    },

    plugins: [
      new webpack.DefinePlugin({
        'process.env.SERVICE_URL': JSON.stringify(env.host || 'http://localhost:8080/')
      })
    ],

    output: {
      library: `[name]`,
      filename: `[name].bundle.js`,
      clean: true
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
}
