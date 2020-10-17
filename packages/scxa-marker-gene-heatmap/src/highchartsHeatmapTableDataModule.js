// This is a module to overwrite `getDataRows` method in `export-data` module
// to get a table-formatted heatmap data
// https://github.com/highcharts/highcharts/issues/7980
(function(H){
  `object` === typeof module && module.exports ?
    module.exports = H :
    H(Highcharts)}
)
(function(H) {
  H.wrap(H.Chart.prototype, `getDataRows`, function(p, opt) {
    let rows = p.call(this, opt),
      longRows = [],
      categories = [],
      yCategories = [rows[0][0]].concat(this.yAxis[0].categories)

    H.each(rows, function(row) {
      let index = categories.indexOf(row[0])

      if (index < 0) {
        index = categories.push(row[0]) - 1
      }

      if (!longRows[index]) {
        longRows[index] = [row[0]]
        longRows[index].x = index
        longRows[index].xValues = [index]
      }

      longRows[index][yCategories.indexOf(row[1])] = row[2]
    })

    longRows[0] = yCategories

    function transpose(a) {
      return Object.keys(a[0]).map(function(c) {
        return a.map(function(r) { return r[c] })
      })
    }
    return transpose(longRows)
  })
})
