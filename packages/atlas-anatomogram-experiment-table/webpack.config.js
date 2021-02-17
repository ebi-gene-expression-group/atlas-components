const path = require(`path`)
const CleanWebpackPlugin = require(`clean-webpack-plugin`)

const commonPublicPath = `/dist/`
const vendorsBundleName = `vendors`

module.exports = {
  entry: {
    anatomogramExperimentTableDemo: [`@babel/polyfill`, `./html/anatomogramExperimentTableDemo.js`],
  },

  plugins: [
    new CleanWebpackPlugin({
      cleanOnceBeforeBuildPatterns: `dist`
    })
  ],

  output: {
    library: `[name]`,
    filename: `[name].bundle.js`,
    publicPath: commonPublicPath
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
        test: /\.(jpe?g|png|gif)$/i,
        use: [
          { loader: `file-loader` },
          {
            loader: `image-webpack-loader`,
            options: {
              query: {
                bypassOnDebug: true,
                mozjpeg: { progressive: true },
                gifsicle: { interlaced: true },
                optipng: { optimizationLevel: 7 }
              }
            }
          }
        ]
      },
      {
        test: /\.svg$/i,
        use: `file-loader`
      }
    ]
  },

  devServer: {
    port: 9000,
    contentBase: path.resolve(__dirname, `html`),
    publicPath: commonPublicPath,
    allowedHosts: [
      'hlcadev2',
      'hlcadev2.westeurope.cloudapp.azure.com'
    ],
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
      "Access-Control-Allow-Headers": "X-Requested-With, content-type, Authorization"
    },
    disableHostCheck: true,
    host: '0.0.0.0',
    // Add if developing a SPA to redirect non-matching routes known by WDS (i.e. no document in /html) to the router
    // historyApiFallback: true
  },

  watchOptions: {
    ignored: ['organ-anatomogram/**', 'node_modules/**']
  }
}
