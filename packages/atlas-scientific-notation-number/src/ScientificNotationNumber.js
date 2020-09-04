import React from 'react'
import PropTypes from 'prop-types'

const removeTrailingZeroes = (str) => str.replace(/(\d)0+$/, `$1`)
const removeLeadingPlus = (str) => str.replace(/^\+/, ``)

const ScientificNotationNumber = ({value, accuracy, style}) => {
  if (value >= 0.1 && value < 100000 || value === 0) {
    return <span>{value}</span>
  }

  const scientificNotationString= value.toExponential(accuracy)
  const mantissaExponent = scientificNotationString.split(`e`)
  const mantissa = removeTrailingZeroes(mantissaExponent[0])
  const exponent = removeLeadingPlus(mantissaExponent[1])

  return(
    <span style={style}>
      {(+mantissa !== 1) ? `${mantissa} × ` : ``}10
      <span style={{verticalAlign: `super`}}>{exponent}</span>
    </span>
  )
}

ScientificNotationNumber.propTypes = {
  value: PropTypes.number.isRequired,
  accuracy: PropTypes.number,
  style: PropTypes.object
}

ScientificNotationNumber.defaultProps = {
  accuracy: 4,
  style: {}
}

export default ScientificNotationNumber
