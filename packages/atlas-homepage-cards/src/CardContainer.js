import React from 'react'
import PropTypes from 'prop-types'
import SpeciesCard from './SpeciesCard'

class CardContainer extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <SpeciesCard/>
    )
  }
}

CardContainer.propTypes = {
  atlasUrl: PropTypes.string
}

export default CardContainer
