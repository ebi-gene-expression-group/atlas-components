const highcharts = jest.genMockFromModule(`highcharts`)
// So that Boost and Exporting modules don’t complain when running tests
highcharts.getOptions = () => ({
   plotOptions: {}
 })
highcharts.win = {
  navigator: {
    userAgent: {}
  },
  document: {
    createElement: () => ({})
  }
}
module.exports = highcharts
