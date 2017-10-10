import React from 'react'
import PropTypes from 'prop-types'
import Color from 'color'

import fetchMock from 'fetch-mock'

import ScatterPlotLoader from './plotloader/PlotLoader'
import AtlasAutocomplete from 'expression-atlas-autocomplete'

import './util/MathRound'

const MAX_WHITE = 90

const _colourizeExpressionLevel = (hue, highlightSeries) =>
  (plotData) => plotData.series.map((aSeries) => {
    if (!highlightSeries.length || highlightSeries.includes(aSeries.name)) {
      return {
        name: aSeries.name,
        data: aSeries.data.map((point) => {
          const white = plotData.max > plotData.min ?
            (1 - (point.expressionLevel - plotData.min) / (plotData.max - plotData.min)) * MAX_WHITE :
            0
          return {
            ...point,
            expressionLevel: Math.round10(point.expressionLevel, -2),
            color: Color(`hwb(${hue}, ${white}%, 0%)`).alpha(0.65).rgb().toString()
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

const GeneExpressionScatterPlot = (props) => {
  const {atlasUrl, suggesterEndpoint, geneId, onSelect} = props             // Suggester
  const {height, plotData, expressionColourHue, highlightClusters} = props  // Chart
  const {loading, resourcesUrl, errorMessage} = props                       // Overlay

  const highchartsConfig = {
    plotOptions: {
      scatter: {
        tooltip: {
          headerFormat: `<b>{point.key} – Cluster {series.name}</b><br>`,
          pointFormat: geneId ? `Expression level: {point.expressionLevel} ${plotData.unit}` : `No gene selected`
        }
      }
    },
    chart: {
      height: height
    }
  }

  const renderGradient = plotData.max && plotData.min && plotData.max > plotData.min
  const chartClassName = renderGradient ? `small-10 columns` : `small-12 columns`
  const gradient = renderGradient ?
    <Gradient height={height} colourHue={expressionColourHue} plotData={plotData}/> : null

  return [
    <AtlasAutocomplete key={`expression-autocomplete`}
                       wrapperClassName={`row column`}
                       atlasUrl={atlasUrl}
                       suggesterEndpoint={suggesterEndpoint}
                       enableSpeciesFilter={false}
                       initialValue={geneId}
                       onSelect={onSelect}
    />,

    <ScatterPlotLoader key={`expression-plot`}
                       wrapperClassName={`row`}
                       chartClassName={chartClassName}
                       series={_colourizeExpressionLevel(expressionColourHue, highlightClusters)(plotData)}
                       highchartsConfig={highchartsConfig}
                       children={gradient}
                       loading={loading}
                       resourcesUrl={resourcesUrl}
                       errorMessage={errorMessage}
    />
  ]
}

const Gradient = ({height, colourHue, plotData}) => {
  const topColour = Color(`hwb(${colourHue}, 0%, 0%)`).rgb().toString()
  const bottomColour = Color(`hwb(${colourHue}, ${MAX_WHITE}%, 0%)`).rgb().toString()

  return (
    <div className={`small-2 columns text-center`}>
      <div><small>{Math.round10(plotData.max, -2)} {plotData.unit}</small></div>
      <div style={{width: `20px`, height: `${height - 100}px`, background: `linear-gradient(${topColour}, ${bottomColour})`, verticalAlign: `middle`, margin: `auto`}}/>
      <div><small>{Math.round10(plotData.min, -2)} {plotData.unit}</small></div>
    </div>
  )
}


GeneExpressionScatterPlot.propTypes = {
  height: PropTypes.number.isRequired,

  plotData: PropTypes.shape({
    series: PropTypes.array.isRequired,
    unit: PropTypes.string.isRequired,
    max: PropTypes.number,
    min: PropTypes.number
  }),
  expressionColourHue: PropTypes.number,
  highlightClusters: PropTypes.array,

  atlasUrl: PropTypes.string.isRequired,
  suggesterEndpoint: PropTypes.string.isRequired,
  geneId: PropTypes.string.isRequired,
  onSelect: PropTypes.func.isRequired,

  loading: PropTypes.bool.isRequired,
  resourcesUrl: PropTypes.string,
  errorMessage: PropTypes.string
}

GeneExpressionScatterPlot.defaultProps = {
  expressionColourHue: 240
}

export {GeneExpressionScatterPlot as default, _colourizeExpressionLevel}
