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
    allowedHosts: [
	      'hlcadev2',
	      'hlcadev2.westeurope.cloudapp.azure.com',
        'www.ebi.ac.uk'
    ],
    static: path.resolve(__dirname, `html`),
    devMiddleware: {
      publicPath: commonPublicPath,
    },
  },
}
