/* eslint-disable react/no-children-prop */
import React from 'react'
import PropTypes from 'prop-types'
import Color from 'color'
import colorize from './colorize'

import ScatterPlotLoader from './plotloader/PlotLoader'
import AtlasAutocomplete from 'expression-atlas-autocomplete'

import './util/MathRound'
import PlotSettingsDropdown from "./PlotSettingsDropdown"

const stops = [
  {
    cutoff: 0.1,
    color: `#d7ffff`
  },
  {
    cutoff: 1,
    color: `#d4e4fb`
  },
  {
    cutoff: 10,
    color: `#95adde`
  },
  {
    cutoff: 100,
    color: `#6077bf`
  },
  {
    cutoff: 1000,
    color: `#1151d1`
  },
  {
    cutoff: 10000,
    color: `#35419b`
  },
  {
    cutoff: 100000,
    color: `#0e0573`
  },
  {
    cutoff: 1000000,
    color: `#07004c`
  }
]
const defaultColor = `lightgrey`
const _colorize = colorize(stops, defaultColor)

const _colourizeExpressionLevel = (highlightSeries) => {
  return (plotData) => plotData.series.map((aSeries) => {
    // I can’t think of a better way to reconcile series.name being a string and highlightSeries being an array of
    // numbers. For more flexibility we might think of having our series be identified by an arbitrary ID string
    if (!highlightSeries.length || highlightSeries.map((hs) => String(hs)).includes(aSeries.name)) {
      return {
        name: aSeries.name,
        data: aSeries.data.map((point) => {
          if (point.expressionLevel > 0.1) {
            return {
              ...point,
              expressionLevel: Math.round10(point.expressionLevel, -2),
              color: _colorize(point.expressionLevel)
            }
          } else {
            delete point.expressionLevel
            return {
              ...point,
              color: Color(`lightgrey`).alpha(0.65).rgb().toString()
            }
          }

        })
      }
    } else {
      return {
        name: aSeries.name,
        data: aSeries.data.map((point) => ({
          ...point,
          expressionLevel: Math.round10(point.expressionLevel, -2),
          color: Color(`lightgrey`).alpha(0.65).rgb().toString()
        }))
      }
    }
  })
}

const GeneExpressionScatterPlot = (props) => {
  const { atlasUrl, suggesterEndpoint, geneId, geneIds, onSelectGeneId, speciesName } = props       // Suggester
  const { height, plotData, highlightClusters } = props  // Chart
  const { loading, resourcesUrl, errorMessage, showControls } = props                       // Overlay
  const plotIsDisabled = !plotData.max

  // Number of significative digits before decimal point
  const dataScale = plotIsDisabled ?
      0 :
      plotData.max <= 1 ?
          0 : // 10^0 = 1
          (plotData.max - 1).toFixed(0).toString().length  // Substract 1 to correctly get boundary values: 1, 10, ...
  const adjustedStops = stops.filter(e => e.cutoff <= 10 ** dataScale)

  const highchartsConfig = {
    chart: {
      height: height,
    },
    title: {
      text: `Gene expression`
    },
    tooltip: {
      formatter: function (tooltip) {
        // Trick Highcharts into thinking the point is in the bottom half of the chart, so that the tooltip
        // is displayed below the point
        this.point.negative = true

        const header = `<b>Cell ID:</b> ${this.point.name}<br>`
        const text = geneId ?
            `<b>Expression level:</b> ${this.point.expressionLevel ?
                `${this.point.expressionLevel} ${plotData.unit}` :
                `Below cutoff`}` :
            `No gene selected`

        return header + text
      }
    },
    marker: {
      symbol: `circle`
    },
    plotOptions: {
      series: {
        colorKey: `expressionLevel`
      }
    },
    colorAxis: plotIsDisabled ?
        {} :
        {
          allowNegativeLog: true,
          min: 0.1,
          max: 10 ** dataScale,
          type: `logarithmic`,
          stops: adjustedStops.map((e, idx) => [1 / adjustedStops.length * idx, e.color]),
          marker: {
            color: `#c4463a`
          },
          endOnTick: false
        },
    legend: plotIsDisabled ?
        {
          enabled: false
        } :
        {
          title: {
            text: `Expression level (CPM)`
          },
          floating: false,
          align: `center`,
          symbolHeight: 5,
          symbolWidth: 450,
          enabled: true
        }
  }

  const geneIdOptions = geneIds.sort((a, b) => a - b).map((geneId) => ({
    value: geneId,
    label: geneId
  }))


  const geneIdControl = geneIds.length ? <PlotSettingsDropdown
          labelText={`Gene Ids:`}
          options={geneIdOptions}
          defaultValue={{value: geneId, label: geneId}}
          onSelect={(event) => {
            onSelectGeneId(event)
          }}/> :
      <AtlasAutocomplete
          wrapperClassName={`row margin-bottom-large`}
          atlasUrl={atlasUrl}
          suggesterEndpoint={suggesterEndpoint}
          initialValue={geneId}
          defaultSpecies={speciesName}
          onSelect={(event) => {
            onSelectGeneId(event)
          }}
          show={showControls}/>

  return (
      <React.Fragment>
        <div style={{visibility: `${showControls ? `visible` : `hidden`}`}}>
          {geneIdControl}
        </div>
        <ScatterPlotLoader
            wrapperClassName={`row`}
            chartClassName={`small-12 columns`}
            series={_colourizeExpressionLevel(highlightClusters)(plotData)}
            highchartsConfig={highchartsConfig}
            loading={loading}
            resourcesUrl={resourcesUrl}
            errorMessage={errorMessage}
        />
      </React.Fragment>
  )
}

GeneExpressionScatterPlot.propTypes = {
  height: PropTypes.number.isRequired,
  showControls: PropTypes.bool.isRequired,

  plotData: PropTypes.shape({
    series: PropTypes.array.isRequired,
    unit: PropTypes.string.isRequired,
    max: PropTypes.number,
    min: PropTypes.number
  }),
  highlightClusters: PropTypes.array,

  atlasUrl: PropTypes.string.isRequired,
  suggesterEndpoint: PropTypes.string.isRequired,
  speciesName: PropTypes.string.isRequired,
  geneId: PropTypes.string.isRequired,
  geneIds: PropTypes.arrayOf(PropTypes.string),
  onSelectGeneId: PropTypes.func.isRequired,

  loading: PropTypes.bool.isRequired,
  resourcesUrl: PropTypes.string,
  errorMessage: PropTypes.string
}

GeneExpressionScatterPlot.defaultProps = {
  geneIds: []
}

export { GeneExpressionScatterPlot as default, _colourizeExpressionLevel }
