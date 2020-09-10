import React from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'

import FacetedSearchContainer from '../../src/index'

const EpisodeCard = props =>
  <div style={{ border: `2px solid grey`, marginBottom: `0.5rem`, borderRadius: `4px`, padding: `0.25rem` }}>
    {props.title}
  </div>

EpisodeCard.propTypes = {
  title: PropTypes.string.isRequired
}

const EpisodesHeader = () =>
  <div style={{textAlign: `center`}}>
    <b>Episode Title</b>
  </div>

const render = (options, target) => {
  ReactDOM.render(
    <FacetedSearchContainer
      {...options}
      ResultsHeaderClass={EpisodesHeader}
      ResultElementClass={EpisodeCard} />,
    document.getElementById(target))
}

export { render }
