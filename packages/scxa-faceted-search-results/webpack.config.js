const CleanWebpackPlugin = require(`clean-webpack-plugin`)

module.exports = {
  entry: {
    fetchLoaderDemo: [`babel-polyfill`, `./html/fetchLoaderDemo.js`],
    facetedSearchContainerDemo: `./html/facetedSearchContainerDemo.js`
  },

  plugins: [
    new CleanWebpackPlugin([`dist`])
  ],

  output: {
    library: `[name]`,
    filename: `[name].bundle.js`
  },

  optimization: {
    splitChunks: {
      chunks: `all`,
      minSize: 1,
      cacheGroups: {
        facetedSearch: {
          test: /[\\/]src[\\/]/,
          name: `facetedSearch`,
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
  }
}
