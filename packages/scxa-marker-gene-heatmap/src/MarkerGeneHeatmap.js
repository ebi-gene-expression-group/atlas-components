import React from 'react'
import PropTypes from 'prop-types'

import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import HighchartsHeatmap from 'highcharts/modules/heatmap'
import HighchartsNoData from 'highcharts/modules/no-data-to-display'
import HighchartsExporting from 'highcharts/modules/exporting'
import HighchartsExportData from 'highcharts/modules/export-data'
import HighchartsGetHeatmapData from './highchartsHeatmapTableDataModule'

import _ from 'lodash'
import URI from 'urijs'

import heatmapOptionsProvider from './heatmapOptionsProvider'

// initialise modules
async function addModules() {
  HighchartsHeatmap(Highcharts)
  HighchartsNoData(Highcharts)
  HighchartsExporting(Highcharts)
  HighchartsExportData(Highcharts)
  HighchartsGetHeatmapData(Highcharts)
}

addModules()

const splitPhrase = (phrase, maxLineLength = 12) => {
  const splitPhrase = [``]

  const words = phrase.split(/\s+/)
  while (words.length > 0) {
    const nextWord = words.shift()
    if (splitPhrase[splitPhrase.length - 1].length + nextWord.length < maxLineLength) {
      splitPhrase[splitPhrase.length - 1] = `${splitPhrase[splitPhrase.length - 1]} ${nextWord}`
    } else {
      splitPhrase.push(nextWord)
    }
  }

  return splitPhrase
}

const checkIfAnnDataExperiment = (experiment_accession) => {
  return new RegExp(`E-ANND-\d*`).test(experiment_accession);
}

Highcharts.SVGRenderer.prototype.symbols.download = (x, y, w, h) => [
  // Arrow stem
  `M`, x + w * 0.5, y,
  `L`, x + w * 0.5, y + h * 0.7,
  // Arrow head
  `M`, x + w * 0.3, y + h * 0.5,
  `L`, x + w * 0.5, y + h * 0.7,
  `L`, x + w * 0.7, y + h * 0.5,
  // Box
  `M`, x, y + h * 0.9,
  `L`, x, y + h,
  `L`, x + w, y + h,
  `L`, x + w, y + h * 0.9
]

const MarkerGeneHeatmap = (props) => {
  const { host, chartHeight, hasDynamicHeight, heatmapRowHeight, heatmapType, species } = props
  const { cellType, data, xAxisCategories, yAxisCategories } = props
  const totalNumberOfRows = Object.keys(_.groupBy(data, `geneName`)).length
  const groupedData = _.groupBy(data, `cellGroupValueWhereMarker`)

  const filteredData = data.map(cell => ({
    ...cell,
    value: cell.value <= 0 ? null : cell.value
  }))

  const plotLines = []
  const cellTypes = Object.keys(groupedData)

  // 175px = title + legend + X axis labels; 8 is the height of a plot line separating the clusters
  const dynamicHeight = (totalNumberOfRows * heatmapRowHeight) + (cellTypes.length * 8) + 175

  let plotLineAxisPosition = -0.5

  // If we don't have a set row height, we try to estimate the height as worked out by Highcharts
  const rowHeight = hasDynamicHeight ?
    heatmapRowHeight :
    Math.round((chartHeight - 175) / totalNumberOfRows + ((cellTypes.length-1) * 8))

  cellTypes.forEach((cellType, idx, array) => {
    const numberOfRows = Object.keys(_.groupBy(groupedData[cellType], `y`)).length // how many marker genes per cluster
    plotLineAxisPosition = plotLineAxisPosition + numberOfRows

    const yOffset = -numberOfRows * rowHeight/2

    let color, zIndex
    // don't show last plot line
    if (idx === array.length-1) {
      // removing the plot line altogether would remove the label, so we need to make it "invisible"
      color = `#FFFFFF`
      zIndex = 0
    }
    else {
      color = `#000000`
      zIndex = 5
    }

    const splitCellTypeLabel = splitPhrase(heatmapOptionsProvider[heatmapType].labelsFormatter(cellType))
    plotLines.push({
      color: color,
      width: 2,
      value: plotLineAxisPosition,
      zIndex: zIndex,
      label: heatmapType !== `cellmultiexperiment` && {
        useHTML: true,
        text:  checkIfAnnDataExperiment(splitCellTypeLabel) ?
            `<img src="https://upload.wikimedia.org/wikipedia/commons/6/6a/External_link_font_awesome.svg" alt="external_link_image" width="11px"/>` +
            splitCellTypeLabel.join(`<br/>`) :
            splitCellTypeLabel.join(`<br/>`),
        align: `right`,
        textAlign: `left`,
        x: 15,
        y: yOffset - Math.max(splitCellTypeLabel.length - 3, 0) * rowHeight / 2,  // Move very long labels slightly up
      }
    })
  })

  const options = {
    chart: {
      type: `heatmap`,
      height: hasDynamicHeight ? dynamicHeight : chartHeight,
      zoomType: `y`,
      animation: false,
      marginRight: data.length !== 0 ? 100 : 0,
      plotBackgroundColor: `#eaeaea`,
      spacingBottom: 0
    },
    lang: {
      noData: heatmapOptionsProvider[heatmapType].noData,
    },
    noData: {
      style: {
        fontWeight: `bold`,
        fontSize: `16px`,
        color: `#000000`
      }
    },
    credits: {
      enabled: false
    },
    title: {
      text: heatmapOptionsProvider[heatmapType].title(cellType),
      widthAdjust: -250,
      style: {
        fontSize: `25px`,
        fontWeight: `bold`
      }
    },
    xAxis: {
      opposite: true,
      categories: xAxisCategories,
      labels: {
        useHTML: true,
        formatter: function() {
          return checkIfAnnDataExperiment(this.value) ?
              `<img src="https://upload.wikimedia.org/wikipedia/commons/6/6a/External_link_font_awesome.svg" alt="external_link_image" width="11px"/> ` +
              heatmapOptionsProvider[heatmapType].labelsFormatter(this.value) :
              heatmapOptionsProvider[heatmapType].labelsFormatter(this.value)
        }
      },
      endOnTick: false,
      gridLineWidth: 0,
      minorGridLineWidth: 0,
      min: 0,
      max: xAxisCategories.length-1,
      showEmpty: false,
      visible: data.length !== 0
    },

    yAxis: {
      categories: yAxisCategories,
      title: {
        text: `Gene ID`,
        style: {
          fontWeight: `bold`
        }
      },
      reversed: true,
      startOnTick: false,
      endOnTick: false,
      gridLineWidth: 0,
      minorGridLineWidth: 0,
      plotLines: plotLines,
      showEmpty: false,
      visible: data.length !== 0,
      labels: {
        formatter: function () {
          return `<a href="${URI(`search`, host).search({q: this.value, species: species}).toString()}" ` +
            `style="border: none; color: #148ff3">${this.value}</a>`
          }
      }
    },

    tooltip: heatmapOptionsProvider[heatmapType].tooltip,

    colorAxis: {
      type: `logarithmic`,
      min: 0.1,
      max: 1000000,
      stops: [
        [0, `#d7ffff`],
        [1/7 * 1, `#d4e4fb`],
        [1/7 * 2, `#95adde`],
        [1/7 * 3, `#6077bf`],
        [1/7 * 4, `#1151d1`],
        [1/7 * 5, `#35419b`],
        [1/7 * 6, `#0e0573`],
        [1, `#07004c`]
      ],
      marker: {
        color: `#e96b23`
      },
    },

    legend: {
      title: {
        text: `Median expression (CPM)`
      },
      align: `center`,
      verticalAlign: `top`,
      layout: `horizontal`,
      symbolWidth: 480,
      enabled: data.length !== 0
    },

    series: [{
      data: filteredData,
      nullColor: `#eaeaea`,
      cursor: `crosshair`,
      states: {
        hover: {
          brightness: 0,
          borderWidth: 2,
          borderColor: `#e96b23`
        }
      },
      turboThreshold: 0
    }],

    boost: {
      useGPUTranslations: true
    },

    navigation: {
      buttonOptions: {
        theme: {
          style: {
            fontSize: `15px`
          },
          states: {
            select: {
              style: {
                fontWeight: `normal`,
                color: `black`
              }
            }
          }
        }
      },
      menuItemStyle: {
        fontSize: `15px`
      }
    },

    exporting: {
      buttons: {
        contextButton: {
          text: `Download`,
          symbol: `download`,
          menuItems: [
            `downloadPNG`,
            `downloadJPEG`,
            `downloadPDF`,
            `downloadSVG`,
            `separator`,
            `downloadCSV`,
            `downloadXLS`
          ]
        }
      }
    }
  }

  return (
    <HighchartsReact
      highcharts={Highcharts}
      options={options}
    />
  )
}

MarkerGeneHeatmap.propTypes = {
  chartHeight: PropTypes.number,
  data: PropTypes.arrayOf(PropTypes.shape({
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
    geneName: PropTypes.string.isRequired,
    value: PropTypes.number.isRequired,
    cellGroupValueWhereMarker: PropTypes.string.isRequired,
    cellGroupValue: PropTypes.string.isRequired
  })).isRequired,
  xAxisCategories: PropTypes.array.isRequired,
  yAxisCategories: PropTypes.array.isRequired,
  hasDynamicHeight: PropTypes.bool.isRequired,
  heatmapRowHeight: PropTypes.number.isRequired,
  species: PropTypes.string.isRequired,
  heatmapType: PropTypes.oneOf(Object.keys(heatmapOptionsProvider)).isRequired,
  host: PropTypes.string,
  cellType: PropTypes.string
}

MarkerGeneHeatmap.defaultProps = {
  chartHeight: 300,
  host: `https://www.ebi.ac.uk/gxa/sc/`,
  cellType: `Cell type`
}

export default MarkerGeneHeatmap
