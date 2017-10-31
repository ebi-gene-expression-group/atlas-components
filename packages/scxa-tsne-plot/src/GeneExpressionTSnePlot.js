import React from 'react'
import PropTypes from 'prop-types'
import Color from 'color'

import ScatterPlotLoader from './plotloader/PlotLoader'
import AtlasAutocomplete from 'expression-atlas-autocomplete'

import './util/MathRound'

const MAX_WHITE = 90


const _colourize = (colourStrings, defaultColour = `blue`, alpha = 0.65) => {
  const colours = colourStrings.map((colourStr) => Color(colourStr))

  return (val) => {
    if (isNaN(val)) {
      return Color(defaultColour).alpha(alpha).rgb().toString()
    }

    const bucket = val <= 0 ? 0 : val >= 1 ? colours.length - 2 : Math.floor(val / (1 / (colours.length - 1)))

    const loColour = colours[bucket]
    const hiColour = colours[bucket + 1]

    const redDelta = hiColour.red() - loColour.red()
    const greenDelta = hiColour.green() - loColour.green()
    const blueDelta = hiColour.blue() - loColour.blue()

    return Color(
      `rgb(` +
      `${Math.floor(loColour.red() + redDelta * val)}, ` +
      `${Math.floor(loColour.green() + greenDelta * val)}, ` +
      `${Math.floor(loColour.blue() + blueDelta * val)})`).alpha(alpha).rgb().toString()
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
          return {
            ...point,
            expressionLevel: Math.round10(point.expressionLevel, -2),
            color: colourize(1 - (point.expressionLevel - plotData.min) / (plotData.max - plotData.min))
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
  const {atlasUrl, suggesterEndpoint, geneId, onSelectGeneId} = props       // Suggester
  const {height, plotData, expressionGradientColours, highlightClusters} = props  // Chart
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
    },
    title: {
      text: `Gene expression`
    }
  }

  const renderGradient = plotData.max && plotData.min && plotData.max > plotData.min
  const chartClassName = renderGradient ? `small-10 columns` : `small-12 columns`
  const gradient = renderGradient ?
    <LinearGradient height={height}
                    colours={expressionGradientColours}
                    plotData={plotData}/> :
    null

  return [
    <AtlasAutocomplete key={`expression-autocomplete`}
                       wrapperClassName={`row column`}
                       atlasUrl={atlasUrl}
                       suggesterEndpoint={suggesterEndpoint}
                       enableSpeciesFilter={false}
                       initialValue={geneId}
                       onSelect={ (event) => { onSelectGeneId(event) } }
    />,

    <ScatterPlotLoader key={`expression-plot`}
                       wrapperClassName={`row`}
                       chartClassName={chartClassName}
                       series={_colourizeExpressionLevel(expressionGradientColours, highlightClusters)(plotData)}
                       highchartsConfig={highchartsConfig}
                       children={gradient}
                       loading={loading}
                       resourcesUrl={resourcesUrl}
                       errorMessage={errorMessage}
    />
  ]
}

const LinearGradient = ({height, colours, plotData}) => {
  const background = colours.map((colour) => Color(colour).rgb().toString()).join(`, `)

  return (
    <div className={`small-2 columns text-center`}>
      <div><small>{Math.round10(plotData.max, -2)} {plotData.unit}</small></div>
      <div style={{width: `20px`, height: `${height - 100}px`, background: `linear-gradient(${background})`, verticalAlign: `middle`, margin: `auto`}}/>
      <div><small>{Math.round10(plotData.min, -2)} {plotData.unit}</small></div>
    </div>
  )
}

LinearGradient.propTypes = {
  height: PropTypes.number.isRequired,
  colours: PropTypes.arrayOf(PropTypes.string).isRequired,
  plotData: PropTypes.shape({
    min: PropTypes.number.isRequired,
    max: PropTypes.number.isRequired,
    unit: PropTypes.string.isRequired
  })
}


GeneExpressionScatterPlot.propTypes = {
  height: PropTypes.number.isRequired,

  plotData: PropTypes.shape({
    series: PropTypes.array.isRequired,
    unit: PropTypes.string.isRequired,
    max: PropTypes.number,
    min: PropTypes.number
  }),
  expressionGradientColours: PropTypes.arrayOf(PropTypes.string).isRequired,
  highlightClusters: PropTypes.array,

  atlasUrl: PropTypes.string.isRequired,
  suggesterEndpoint: PropTypes.string.isRequired,
  onSelectGeneId: PropTypes.func.isRequired,

  loading: PropTypes.bool.isRequired,
  resourcesUrl: PropTypes.string,
  errorMessage: PropTypes.string
}

GeneExpressionScatterPlot.defaultProps = {
  expressionGradientColours: [`rgb(0, 0, 115)`, `rgb(0, 85, 225)`, `rgb(128, 255, 255)`, `rgb(215, 255, 255)`]
}

export {GeneExpressionScatterPlot as default, _colourizeExpressionLevel}
