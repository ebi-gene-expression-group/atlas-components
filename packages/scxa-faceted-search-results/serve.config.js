const path = require(`path`)
module.exports = require(`./webpack.config.js`)

module.exports.mode = `development`
module.exports.devtool = `source-map`
// Must match module.exports.serve.dev.publicPath or bad things may happen
module.exports.output.publicPath = `/dist`

module.exports.serve = {
  content: path.resolve(__dirname, `html`),
  devMiddleware: {
    publicPath: `/dist/`
  },

  port: 9000
}
