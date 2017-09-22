import Color from 'color'
import './util/MathRound10'

const _colourizeClusters = (highlightSeries, dimColour) => {
  return (series) => series.map((aSeries) => ({
    name: aSeries.name,
    data: aSeries.data.map((point) => {
      if (!highlightSeries.length || highlightSeries.includes(aSeries.name)) {
        return point
      } else {
        return {
          ...point,
          color: dimColour
        }
      }
    })
  }))
}

const _colourizeExpressionLevel = (hue, lightness) => {
  return (series) => {
    const allPoints = series.reduce((acc, series) => acc.concat(series.data), [])

    const min = Math.min(...allPoints.map((point) => point.expressionLevel))
    const max = Math.max(...allPoints.map((point) => point.expressionLevel))

    return series.map((aSeries) => ({
      name: aSeries.name,
      data: aSeries.data.map((point) => {
        const saturation = max > min ? (point.expressionLevel - min) / (max - min) * 100 : 0
        return {
          ...point,
          expressionLevel: Math.round10(point.expressionLevel, -2),
          color: Color(`hsl(${hue}, ${saturation}%, ${lightness}%)`).rgb().toString()
        }
      })
    }))
  }
}

export {_colourizeClusters, _colourizeExpressionLevel}
