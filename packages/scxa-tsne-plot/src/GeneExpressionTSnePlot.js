/* eslint-disable react/no-children-prop */
import React from 'react'
import PropTypes from 'prop-types'
import Color from 'color'

import ScatterPlotLoader from './plotloader/PlotLoader'
import AtlasAutocomplete from 'expression-atlas-autocomplete'

import './util/MathRound'
import Responsive from 'react-responsive'


const Desktop = props => <Responsive {...props} minWidth={1800} />
const Tablet = props => <Responsive {...props} minWidth={1000} maxWidth={1799} />
const Mobile = props => <Responsive {...props} minWidth={767} maxWidth={999} />
const Default = props => <Responsive {...props} maxWidth={766} />


const _colourize = (colourRanges, defaultColour = `blue`, alpha = 0.65) => {
  return (val) => {
    if (isNaN(val)) {
      return Color(defaultColour).alpha(alpha).rgb().toString()
    }

    if (val === 0) {
      return Color(`lightgrey`).alpha(alpha).rgb().toString()
    }

    if (val > 9999) {
      return Color(`rgb(0, 0, 115)`).alpha(alpha).rgb().toString()
    }

    const rangeIndex = val <= 0 ? 0 : colourRanges.findIndex((colourRange) => colourRange.threshold >= val) - 1

    const loColour = Color(colourRanges[rangeIndex].colour)
    const hiColour = Color(colourRanges[rangeIndex + 1].colour)

    const redDelta = hiColour.red() - loColour.red()
    const greenDelta = hiColour.green() - loColour.green()
    const blueDelta = hiColour.blue() - loColour.blue()
    const increment = (val - colourRanges[rangeIndex].threshold) / (colourRanges[rangeIndex + 1].threshold - colourRanges[rangeIndex].threshold)

    return Color(
      `rgb(` +
      `${Math.floor(loColour.red() + redDelta * increment)}, ` +
      `${Math.floor(loColour.green() + greenDelta * increment)}, ` +
      `${Math.floor(loColour.blue() + blueDelta * increment)})`
    ).alpha(alpha).rgb().toString()
  }
}


const _colourizeExpressionLevel = (gradientColours, highlightSeries) => {
  const colourize = _colourize(gradientColours)
  return (plotData) => plotData.series.map((aSeries) => {
    // I can’t think of a better way to reconcile series.name being a string and highlightSeries being an array of
    // numbers. For more flexibility we might think of having our series be identified by an arbitrary ID string

    if (!highlightSeries.length || highlightSeries.map((hs) => String(hs)).includes(aSeries.name)) {
      return {
        name: aSeries.name,
        data: aSeries.data.map((point) => {
          if(point.expressionLevel > 0){
            return {
              ...point,
              expressionLevel: Math.round10(point.expressionLevel, -2),
              colorValue: Math.round10(point.expressionLevel, -2)
            }
          } else {
            return {
              ...point,
              expressionLevel: Math.round10(point.expressionLevel, -2),
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
  const {atlasUrl, suggesterEndpoint, geneId, onSelectGeneId, speciesName} = props       // Suggester
  const {height, plotData, expressionGradientColours, highlightClusters} = props  // Chart
  const {loading, resourcesUrl, errorMessage, showControls} = props                       // Overlay
  const colourSchema = [`#d4e4fb`,`#95adde`,`#6077bf`,`#1151D1`,`#35419b`,`#0e0573`] // light blue to dark blue
  const colourSchemaLength = colourSchema.length
  const plotIsDisabled = !plotData.max

  const dataScale = plotIsDisabled ?
    0 :
    plotData.max.toFixed(0).toString().length // Number of digits before decimal point
  const highchartsConfig = {
    chart: {
      // Magic number to adjust the height discrepancy between the two charts
      height: plotIsDisabled ? height - 12 : height
    },
    title: {
      text: `Gene expression`
    },
    tooltip: {
      formatter: function(tooltip) {
        // Trick Highcharts into thinking the point is in the bottom half of the chart, so that the tooltip
        // is displayed below the point
        this.point.negative = true

        const header = `<b>Cell ID:</b> ${this.point.name}<br>`
        const text = geneId ?
          `<b>Expression level:</b> ${this.point.expressionLevel} ${plotData.unit}` :
          `No gene selected`

        return header + text
      }
    },
    marker: {
      symbol: `circle`
    },
    colorAxis: plotIsDisabled ?
      {} :
      {
        min: 0.1,
        max: 10 ** dataScale - 1,
        type: `logarithmic`,
        reversed: false,
        //Dynamic stop where the last change colour is 100K
        stop: colourSchema.map((val,idx) => {
          return idx <= (Math.min(dataScale,colourSchemaLength) - 1) ?
            [(idx + 1)/Math.min(dataScale,colourSchemaLength),val] : []
        }),
        minColor:`rgb(215, 255, 255)`,
        maxColor: dataScale > colourSchemaLength ?
          colourSchema[colourSchemaLength - 1] : colourSchema[dataScale - 1],
        marker: {
          color: `#c4463a`
        }
      },
    legend: plotIsDisabled ?
      {
        enabled: false
      } :
      {
        title: {
          text: `Expression level (TPM)`
        },
        floating: false,
        align: `center`,
        symbolHeight: 5,
        symbolWidth: 450
      }
  }

  const responsiveComponent = width =>
    <ScatterPlotLoader
      key={`expression-plot`}
      wrapperClassName={`row`}
      chartClassName={`small-12 columns`}
      series={_colourizeExpressionLevel(expressionGradientColours, highlightClusters)(plotData)}
      highchartsConfig={highchartsConfig}
      loading={loading}
      legendWidth={width}
      resourcesUrl={resourcesUrl}
      errorMessage={errorMessage}
    />

  return [
    showControls &&
      <AtlasAutocomplete
        key={`expression-autocomplete`}
        wrapperClassName={`row margin-bottom-large`}
        atlasUrl={atlasUrl}
        suggesterEndpoint={suggesterEndpoint}
        initialValue={geneId}
        defaultSpecies={speciesName}
        onSelect={(event) => {
          onSelectGeneId(event)
        }}
      />,
    //react-responsive design
    <div key={`scatter-plot`} style={ showControls ? {} : {marginTop: `13%`}}>
      <Desktop key={`Desktop`}>
        {responsiveComponent(1800 / 2.2)}
      </Desktop>
      <Tablet key={`Tablet`}>
        {responsiveComponent(1000 / 2.2)}
      </Tablet>
      <Mobile key={`Mobile`}>
        {responsiveComponent(750)}
      </Mobile>
      <Default key={`Default`}>
        {responsiveComponent(350)}
      </Default>
    </div>
  ]
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
  expressionGradientColours: PropTypes.arrayOf(PropTypes.shape({
    colour: PropTypes.string.isRequired,
    threshold: PropTypes.number.isRequired,
    stopPosition: PropTypes.number.isRequired
  })).isRequired,
  highlightClusters: PropTypes.array,

  atlasUrl: PropTypes.string.isRequired,
  suggesterEndpoint: PropTypes.string.isRequired,
  speciesName: PropTypes.string.isRequired,
  onSelectGeneId: PropTypes.func.isRequired,

  loading: PropTypes.bool.isRequired,
  resourcesUrl: PropTypes.string,
  errorMessage: PropTypes.string
}

GeneExpressionScatterPlot.defaultProps = {
  expressionGradientColours: [
    {
      colour: `rgb(215, 255, 255)`,
      threshold: 0,
      stopPosition: 0
    },
    {
      colour: `rgb(128, 255, 255)`,
      threshold: 10,
      stopPosition: 20
    },
    {
      colour: `rgb(0, 85, 225)`,
      threshold: 100,
      stopPosition: 40
    },
    {
      colour: `rgb(0, 0, 115)`,
      threshold: 10000,
      stopPosition: 100
    }
  ]
}

export {GeneExpressionScatterPlot as default, _colourizeExpressionLevel}
