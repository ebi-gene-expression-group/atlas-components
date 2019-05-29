const CleanWebpackPlugin = require(`clean-webpack-plugin`)
const path = require(`path`)

const commonPublicPath = `/dist/`
const vendorsBundleName = `vendors`

module.exports = {
  entry: {
    extendableCardDemo: [`@babel/polyfill`, `./html/ExtendableCardDemo.js`],
    animalSpeciesSummary: [`@babel/polyfill`, `./html/AnimalSpeciesSummary.js`],
    experimentsPanelDemo: [`@babel/polyfill`, `./html/ExperimentsPanelDemo.js`],
    responsiveCardsRowDemo: [`@babel/polyfill`, `./html/ResponsiveCardsRowWithExtCardsDemo.js`],
    carouselCardsPanelDemo: [`@babel/polyfill`, `./html/CarouselCardsPanelDemo.js`]
  },

  plugins: [
    new CleanWebpackPlugin({
      cleanOnceBeforeBuildPatterns: `dist`
    })
  ],

  output: {
    library: `[name]`,
    path: path.resolve(__dirname, `dist`),
    filename: `[name].bundle.js`,
    publicPath: `/html/`
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
    contentBase: path.resolve(__dirname, `html`),
    publicPath: commonPublicPath
  }
}
