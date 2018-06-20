import React from 'react'
import PropTypes from 'prop-types'

const EpisodeCard = ({title}) =>
  <div style={{border: `2px solid grey`, marginBottom: `0.5rem`, borderRadius: `4px`, padding: `0.25rem`}}>
    {title}
  </div>

EpisodeCard.propTypes = {
  title: PropTypes.string.isRequired
}

export default EpisodeCard
