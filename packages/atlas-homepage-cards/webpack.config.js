const { CleanWebpackPlugin } = require(`clean-webpack-plugin`)
const path = require(`path`)
const webpack = require('webpack')

const commonPublicPath = `/dist/`
const vendorsBundleName = `vendors`

module.exports =  (env) => {
  return {
    entry: {
      extendableCardDemo: [`@babel/polyfill`, `./html/ExtendableCardDemo.js`],
      animalSpeciesSummary: [`@babel/polyfill`, `./html/AnimalSpeciesSummary.js`],
      experimentsPanelDemo: [`@babel/polyfill`, `./html/ExperimentsPanelDemo.js`],
      responsiveCardsRowDemo: [`@babel/polyfill`, `./html/ResponsiveCardsRowWithExtCardsDemo.js`],
      carouselCardsPanelDemo: [`@babel/polyfill`, `./html/CarouselCardsPanelDemo.js`]
    },

    plugins: [
      new CleanWebpackPlugin(),
      new webpack.DefinePlugin({
        'process.env.SERVICE_URL': JSON.stringify(env.host || 'http://localhost:8080/')
      })
    ],

    output: {
      library: `[name]`,
      path: path.resolve(__dirname, `dist`),
      filename: `[name].bundle.js`,
      publicPath: `/html/`,
      devtoolNamespace: `firefox`
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
      static: path.resolve(__dirname, 'html'),
      devMiddleware: {
        publicPath: commonPublicPath,
      }
    }
  }

}
