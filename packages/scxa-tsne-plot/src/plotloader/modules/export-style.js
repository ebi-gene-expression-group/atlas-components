//code is sourced from http://jsfiddle.net/zfngxoow/
(
  function(H){
  `object` === typeof module && module.exports ?
    module.exports = H :
    H(Highcharts)}
)

(function (H) {
  H.wrap(H.Renderer.prototype, `label`, function (proceed, str, x, y, shape, anchorX, anchorY, useHTML) {
    if(/class="icon/.test(str))	useHTML = true
    // Run original proceed method
    return proceed.apply(this, [].slice.call(arguments, 1))
  })
})