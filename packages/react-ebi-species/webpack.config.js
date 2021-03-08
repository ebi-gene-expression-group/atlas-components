module.exports = {
  entry: {
    reactEbiSpecies: `./src/index.js`,
    reactEbiSpeciesBare: `./src/index.js`,
    reactEbiSpeciesClassyDemo: `./html/classyDemo.js`,
    reactEbiSpeciesBareDemo: `./html/bareDemo.js`
  },

  output: {
    library: `[name]`,
    filename: `[name].bundle.js`,
    devtoolNamespace: `webpack`,
    clean: true
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
    // injectClient: false, // webpack-dev-server@3 https://github.com/webpack/webpack-dev-server/issues/2484
    port: 9000,
    static: `./html`,
    dev: {
      publicPath: `/dist`
    }
  }
}
