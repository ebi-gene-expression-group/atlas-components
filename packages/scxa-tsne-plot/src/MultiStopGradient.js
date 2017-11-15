import React from 'react'
import PropTypes from 'prop-types'

import ScientificNotationNumber from 'expression-atlas-number-format'

import './util/MathRound'

// ranges have at least threshold (in ascending order) and stopPosition [0..100]
const putInRange = (ranges, val) => {
  const stopMatch = ranges.filter((range) => range.threshold === val)
  if (stopMatch.length) {
    return stopMatch[0].stopPosition / 100
  }

  const rangeIndex = ranges.findIndex((range) => range.threshold >= val) - 1

  const withinRangeOffset =
    (val - ranges[rangeIndex].threshold) / (ranges[rangeIndex + 1].threshold - ranges[rangeIndex].threshold)

  return (ranges[rangeIndex].stopPosition + (ranges[rangeIndex + 1].stopPosition - ranges[rangeIndex].stopPosition) * withinRangeOffset) / 100
}

const lineHeight = 24
const Tick = ({value, colour, top}) =>
  <div style={{position: `absolute`, height: `2px`, width: `20px`, background: colour, top: `${top + lineHeight}px`}}>
    <div style={{position: `absolute`, marginLeft: `24px`, marginTop: `-${lineHeight / 2}px`}}>
      <small style={{color: colour}}><ScientificNotationNumber value={Math.round10(value, -2)}/></small>
    </div>
  </div>

const MultiStopGradient = ({height, showTicks, colourRanges, plotData}) => {
  const bg = colourRanges.map((colourRange) => `${colourRange.colour} ${colourRange.stopPosition}%`).join(`, `)
  const minMaxExpressionTickHeight = 2
  const gradientHeight = height - 100

  const minExpressionTopPosition =
    Math.min(
      gradientHeight - minMaxExpressionTickHeight,
      gradientHeight - gradientHeight * putInRange(colourRanges, plotData.min))
  const maxExpressionTopPosition =
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

      <Tick value={plotData.max} colour={`dimgray`} top={maxExpressionTopPosition}/>
      <Tick value={plotData.min} colour={`dimgray`} top={minExpressionTopPosition}/>

      {showTicks &&
        colourRanges.slice(1, -1).map((colourRange) =>
          <Tick key={colourRange.threshold} value={colourRange.threshold} colour={`lightgray`} top={gradientHeight - gradientHeight * putInRange(colourRanges, colourRange.threshold)}/>
      )}
      </div>

      <div>
        <small><ScientificNotationNumber value={colourRanges[0].threshold}/> {plotData.unit}</small>
      </div>
    </div>
  )
}

MultiStopGradient.propTypes = {
  height: PropTypes.number.isRequired,
  showTicks: PropTypes.bool,
  colourRanges: PropTypes.arrayOf(PropTypes.shape({
    colour: PropTypes.string.isRequired,
    threshold: PropTypes.number.isRequired,
    stopPosition: PropTypes.number.isRequired
  })).isRequired,
  plotData: PropTypes.shape({
    min: PropTypes.number.isRequired,
    max: PropTypes.number.isRequired,
    unit: PropTypes.string.isRequired
  })
}

export default MultiStopGradient
