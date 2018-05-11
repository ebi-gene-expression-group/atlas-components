import React from 'react'
import PropTypes from 'prop-types'

const EpisodeCard = ({title}) =>
  <div>
    <p>{title}</p>
  </div>

EpisodeCard.propTypes = {
  text: PropTypes.string.isRequired
}

export default EpisodeCard
