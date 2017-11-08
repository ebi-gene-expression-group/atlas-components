import React from 'react'
import PropTypes from 'prop-types'

import ScientificNotationNumber from 'expression-atlas-number-format'

import './util/MathRound'

// ranges have at least threshold (in ascending order) and stopPosition [0..100]
const putInRange = (ranges, val) => {
  if (val <= ranges[0].threshold) {
    return 0
  }

  if (val >= ranges[ranges.length - 1].threshold) {
    return 1
  }

  const rangeIndex = ranges.findIndex((range) => range.threshold >= val) - 1

  const withinRangeOffset =
    (val - ranges[rangeIndex].threshold) / (ranges[rangeIndex + 1].threshold - ranges[rangeIndex].threshold)

  return ranges[rangeIndex].stopPosition * (1 + withinRangeOffset) / 100
}



const MultiStopGradient = ({height, colourRanges, plotData}) => {
  const bg = colourRanges.map((colourRange) => `${colourRange.colour} ${colourRange.stopPosition}%`).join(`, `)
  const minMaxExpressionTickHeight = 2
  const gradientHeight = height - 100

  const minExpressionBottom =
    Math.min(
      gradientHeight - minMaxExpressionTickHeight,
      gradientHeight - gradientHeight * putInRange(colourRanges, plotData.min))
  const maxExpressionBottom =
    Math.max(
      minMaxExpressionTickHeight,
      gradientHeight - gradientHeight * putInRange(colourRanges, plotData.max))

  return (
    <div className={`small-2 columns text-center`}>
      <div>
        <small><ScientificNotationNumber value={colourRanges[colourRanges.length - 1].threshold}/> {plotData.unit}</small>
      </div>

      <div
        style={{
        width: `20px`,
        height: `${gradientHeight}px`,
        background: `linear-gradient(0deg, ${bg})`,
        verticalAlign: `middle`,
        margin: `auto`}}>

        <div style={{position: `relative`, height: `2px`, width: `20px`, background: `grey`, top: `${maxExpressionBottom}px`}}>
          <div style={{position: `absolute`, marginLeft: `24px`, marginTop: `-0.75rem`}}>
            <small><ScientificNotationNumber value={Math.round10(plotData.max, -2)}/></small>
          </div>
        </div>
        <div style={{position: `relative`, height: `2px`, width: `20px`, background: `grey`, top: `${minExpressionBottom}px`}}>
          <div style={{position: `absolute`, marginLeft: `24px`, marginTop: `-0.75rem`}}>
            <small><ScientificNotationNumber value={Math.round10(plotData.min, -2)}/></small>
          </div>
        </div>

      </div>

      <div>
        <small><ScientificNotationNumber value={colourRanges[0].threshold}/> {plotData.unit}</small>
      </div>
    </div>
  )
}

MultiStopGradient.propTypes = {
  height: PropTypes.number.isRequired,
  colourRanges: PropTypes.arrayOf(PropTypes.shape({
    colour: PropTypes.string.isRequired,
    threshold: PropTypes.number.isRequired
  })).isRequired,
  plotData: PropTypes.shape({
    min: PropTypes.number.isRequired,
    max: PropTypes.number.isRequired,
    unit: PropTypes.string.isRequired
  })
}

export default MultiStopGradient
