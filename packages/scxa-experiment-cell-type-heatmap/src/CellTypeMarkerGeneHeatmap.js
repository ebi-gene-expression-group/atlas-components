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

// initialise modules
async function addModules() {
  HighchartsHeatmap(Highcharts)
  HighchartsNoData(Highcharts)
  HighchartsExporting(Highcharts)
  HighchartsExportData(Highcharts)
  HighchartsGetHeatmapData(Highcharts)
}

addModules()

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

const CellTypeMarkerGeneHeatmap = (props) => {
  const { chartHeight, hasDynamicHeight, heatmapRowHeight, species } = props
  const { data, isDataFiltered, xAxisCategories, yAxisCategories } = props
  const totalNumberOfRows = Object.keys(_.groupBy(data, `geneName`)).length
  const groupedData = _.groupBy(data, `cellType`)

  const plotLines = []
  const cellTypes = Object.keys(groupedData)

  // 175px = title + legend + X axis labels; 8 is the height of a plot line separating the clusters
  const dynamicHeight = (totalNumberOfRows * heatmapRowHeight) + (cellTypes.length * 8) + 175

  // We don't need to worry about plotlines and labels if the heatmap is showing data filtered by cluster ID
  if (!isDataFiltered) {
    let plotLineAxisPosition = -0.5

    // If we don't have a set row height, we try to estimate the height as worked out by Highcharts
    const rowHeight = hasDynamicHeight ?
      heatmapRowHeight :
      Math.round((chartHeight - 175) / totalNumberOfRows + ((cellTypes.length-1) * 8))

    cellTypes.forEach((cellType, idx, array) => {
      const numberOfRows = Object.keys(_.groupBy(groupedData[cellType], `cellTypeWhereMarker`)).length // how many marker genes per cluster
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

      plotLines.push({
        color: color,
        width: 2,
        value: plotLineAxisPosition,
        zIndex: zIndex,
        label: {
          text: cellType,
          align: `right`,
          textAlign: `left`,
          x: 15,
          y: yOffset,
          style: {
            fontWeight: `bold`,
            fontSize: `12px`
          }
        }
      })
    })
  }

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
      noData: `There are no marker genes for this k value. Try selecting another k.`,
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
      text: `Marker genes`,
      style: {
        fontSize: `25px`,
        fontWeight: `bold`
      }
    },
    xAxis: {
      opposite: true,
      categories: xAxisCategories,
      labels: {
        useHtml: true,
        formatter: function () {
          if (isDataFiltered && this.value === data[0].cellType) {
            return `<span style="font-size: 12px; font-weight: bold; color: #e96b23;">Cell Type ${this.value}</span>`
          }
          else {
            return `Cell Type ${this.value}`
          }
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
        useHTML: true,
        formatter: function () {
          return `<a href="https://www.ebi.ac.uk/gxa/sc/search?q=${this.value}&species=${species}"` +
            `style="border: none; color: #148ff3">${this.value}</a>`
          }
      }
    },

    tooltip: {
      // followPointer: true,
      formatter: function () {
        if(this.point.value === null) {
          return `<b>Cell type:</b> ${this.point.cellType}<br/>` +
                 `<b>Gene ID:</b> ${this.point.geneName}<br/>` +
                 `<b>Expression:</b> Not expressed<br/>`
        }
        else {
          const text = `<b>Cell type:</b> ${this.point.cellType}<br/>` +
            `<b>Cell type where marker:</b> ${this.point.cellTypeWhereMarker}<br/>` +
            `<b>Gene ID:</b> ${this.point.geneName}<br/>` +
                       `<b>Expression:</b> ${+this.point.value.toFixed(3)} CPM`

          if(this.point.clusterIdWhereMarker === this.point.x+1) {
            return text + `<br/><b>P-value:</b> ${this.point.pValue.toExponential(3)}`
          }
          else {
            return text
          }
        }
      }
    },

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
      data: data,
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
    <div>
      <HighchartsReact
        highcharts={Highcharts}
        options={options}
      />
    </div>
  )
}

CellTypeMarkerGeneHeatmap.propTypes = {
  chartHeight: PropTypes.number.isRequired,
  data: PropTypes.arrayOf(PropTypes.shape({
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
    geneName: PropTypes.string.isRequired,
    value: PropTypes.number.isRequired,
    cellTypeWhereMarker: PropTypes.string.isRequired,
    cellType: PropTypes.string.isRequired
  })).isRequired,
  isDataFiltered: PropTypes.bool.isRequired,
  xAxisCategories: PropTypes.array.isRequired,
  yAxisCategories: PropTypes.array.isRequired,
  hasDynamicHeight: PropTypes.bool.isRequired,
  heatmapRowHeight: PropTypes.number.isRequired,
  species: PropTypes.string.isRequired
}

export default CellTypeMarkerGeneHeatmap
