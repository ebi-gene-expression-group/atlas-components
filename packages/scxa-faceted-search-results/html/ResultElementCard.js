import React from 'react'
import PropTypes from 'prop-types'

const ResultElementCard = ({text}) =>
  <div>
    <p>{text}</p>
  </div>

ResultElementCard.propTypes = {
  text: PropTypes.string.isRequired
}

export default ResultElementCard
