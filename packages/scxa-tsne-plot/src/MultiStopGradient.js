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

const Tick = ({value, tickStyle, top, position}) =>
  <div className={styles[tickStyle]} style={{top: `${top + lineHeight}px`}}>
    <small className={styles[position]}><ScientificNotationNumber value={Math.round10(value, -2)}/></small>
  </div>

Tick.propTypes = {
  value: PropTypes.number,
  tickStyle: PropTypes.string,
  top: PropTypes.number,
  position: PropTypes.string
}

const MultiStopGradient = ({height, showTicks, colourRanges, plotData}) => {
  const bg = colourRanges.map((colourRange) => `${colourRange.colour} ${colourRange.stopPosition}%`).join(`, `)
  const minMaxExpressionTickHeight = 2
  const gradientHeight = height - 100

  const minExpressionTopPosition =
    plotData.min < 9999 ?
      Math.min(
        gradientHeight - minMaxExpressionTickHeight,
        gradientHeight - gradientHeight * putInRange(colourRanges, plotData.min)) :
      gradientHeight - gradientHeight * putInRange(colourRanges, 10000)

  const maxExpressionTopPosition =
    plotData.max < 999 ?
      Math.max(
        minMaxExpressionTickHeight,
        gradientHeight - gradientHeight * putInRange(colourRanges, plotData.max)) :
      gradientHeight - gradientHeight * putInRange(colourRanges, 10000)  

  return (
    <div className={`small-2 columns text-center`}>
      <small><ScientificNotationNumber value={colourRanges[colourRanges.length - 1].threshold}/> {plotData.unit}</small>

      <div className={styles.gradient}
        style={{
          height: `${gradientHeight}px`,
          background: `linear-gradient(0deg, ${bg})`}}>

        <Tick value={plotData.max} tickStyle={`dimgray`} top={maxExpressionTopPosition} position={`left`}/>
        {
          plotData.min < plotData.max &&
        <Tick value={plotData.min} tickStyle={`dimgray`} top={minExpressionTopPosition} position={`left`}/>
        }

        {showTicks &&
        colourRanges.slice(1, -1).map((colourRange) =>
          <Tick key={colourRange.threshold} value={colourRange.threshold} tickStyle={`lightgray`} top={gradientHeight - gradientHeight * putInRange(colourRanges, colourRange.threshold)} position={`right`}/>
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
