# t-SNE plot for Single Cell Expression Atlas experiments

[![Build Status](https://travis-ci.org/ebi-gene-expression-group/scxa-experiment-page-tsne-plot-view.svg?branch=master)](https://travis-ci.org/ebi-gene-expression-group/scxa-experiment-page-tsne-plot-view) [![Coverage Status](https://coveralls.io/repos/github/ebi-gene-expression-group/scxa-experiment-page-tsne-plot-view/badge.svg?branch=master)](https://coveralls.io/github/ebi-gene-expression-group/scxa-experiment-page-tsne-plot-view?branch=master)

Visualisation of [t-SNE plots](https://lvdmaaten.github.io/tsne/) of single cell expression experiments for [Single Cell Expression Atlas](https://www.ebi.ac.uk/gxa/sc). The component is able to select and display different plots for more than one perplexity value, and several clustering strategies. At the moment only the number of clusters produced by different values of *k* in [single-cell consensus clustering (SC3)](http://www.sanger.ac.uk/science/tools/single-cell-consensus-clustering-sc3) is supported.

It uses [Highcharts](https://www.highcharts.com/) for plotting and expects the `series` property in the JSON payload of both plots to adhere to [Highcharts series format for scatter plots](https://api.highcharts.com/highcharts/series.scatter).

Elements use classes from the [EBI Visual Framework](https://github.com/ebiwd/EBI-Framework/) for styling and layout.

To test this component, please uncomment `HighchartsExporting(Highcharts)
 HighchartsOfflineExporting(Highcharts)   HighchartsBoost(Highcharts)` in `Scatterplot.js` first, as highcharts wrappers are not been supported in the test.