import React from 'react'
import PropTypes from 'prop-types'

import ScientificNotationNumber from 'expression-atlas-number-format'

import './util/MathRound'

import styles from './MultiStopGradient.css'

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

const Tick = ({value, colour, top, position}) =>
  <div className={styles.tick} style={{background: colour, top: `${top + lineHeight}px`}}>
    <div className={styles[position]}>
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
      <div style={{whiteSpace: `nowrap`}}>
        <small><ScientificNotationNumber value={colourRanges[colourRanges.length - 1].threshold}/> {plotData.unit}</small>
      </div>

      <div className={styles.gradient}
        style={{
        height: `${gradientHeight}px`,
        background: `linear-gradient(0deg, ${bg})`}}>

      <Tick value={plotData.max} colour={`dimgray`} top={maxExpressionTopPosition} position={`left`}/>
      {
        plotData.min < plotData.max &&
        <Tick value={plotData.min} colour={`dimgray`} top={minExpressionTopPosition} position={`left`}/>
      }

      {showTicks &&
        colourRanges.slice(1, -1).map((colourRange) =>
          <Tick key={colourRange.threshold} value={colourRange.threshold} colour={`lightgray`} top={gradientHeight - gradientHeight * putInRange(colourRanges, colourRange.threshold)} position={`right`}/>
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
