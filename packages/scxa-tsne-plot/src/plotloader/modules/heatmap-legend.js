export default function (H, colourKey) {
  // add colorAxis
  H.seriesTypes.scatter.prototype.axisTypes = [`xAxis`, `yAxis`, `colorAxis`]
  H.seriesTypes.scatter.prototype.optionalAxis = `colorAxis`

  // Ideally we want the legend module to colour points, but for Boost to be able to paint points with specific colours
  // we need to set the colour ourselves before rendering the chart. There’s a commented block in the Boost module
  // regarding the colour axis. We should investigate this to remove the colouring boilerplate.

  // draw points and add setting colors
  // H.wrap(H.seriesTypes.scatter.prototype, `translate`, function (p) {
  //   p.call(this)
  //   H.seriesTypes.heatmap.prototype.translateColors.call(this)
  // })

  // copy method from heatmap for color mixin
  // H.seriesTypes.scatter.prototype.translateColors = H.seriesTypes.heatmap.prototype.translateColors

  // field name to calculate color
  H.seriesTypes.scatter.prototype.colorKey = colourKey
}
