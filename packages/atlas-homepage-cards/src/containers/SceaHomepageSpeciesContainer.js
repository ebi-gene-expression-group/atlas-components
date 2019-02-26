import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import cardPropTypes from '../cards/cardPropTypes'
import SpeciesCard from '../cards/SpeciesCard'

const CardContainer = styled.div`
  border-radius: 8px;
  :hover {
    background: AliceBlue;
  }
`

const SceaHomepageSpeciesContainer = ({cards}) =>
  <div className={`row small-up-2 medium-up-6`}>
    {
      Array.isArray(cards) &&
      cards.map((card, index) =>
        <CardContainer className={`column column-block`} key={index}>
          <SpeciesCard {...card} />
        </CardContainer>
      )
    }
  </div>

SceaHomepageSpeciesContainer.propTypes = {
  cards: PropTypes.arrayOf(PropTypes.shape(cardPropTypes)).isRequired
}

export default SceaHomepageSpeciesContainer
