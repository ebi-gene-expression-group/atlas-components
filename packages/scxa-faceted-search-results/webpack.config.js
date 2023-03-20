const path = require(`path`)
const { CleanWebpackPlugin } = require(`clean-webpack-plugin`)

const vendorsBundleName = `vendors`

module.exports = {
  entry: {
    facetedSearchContainerWithFetchLoaderDemo: [`@babel/polyfill`, `./html/fetch-loader/demo.js`],
    facetedSearchContainerDemo: [`@babel/polyfill`, `./html/container/demo.js`]
  },

  plugins: [
    new CleanWebpackPlugin({
      verbose: true,
      cleanOnceBeforeBuildPatterns: `dist`
    })
  ],

  output: {
    library: `[name]`,
    filename: `[name].bundle.js`,
    devtoolNamespace: `webpack`,
    clean:true
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
      }
    ]
  },

  devServer: {
    port: 9000,
    static: `./html`,
    devMiddleware: {
      publicPath: `/dist`
    }
  }
}
