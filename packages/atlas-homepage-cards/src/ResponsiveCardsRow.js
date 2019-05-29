import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import cardPropTypes from './modelPropTypes'
import Card from './Card'

const ResponsiveCardsRow = (props) => {
  const { CardClass, cards } = props
  const { className, cardContainerClassName, speciesIconHeight, imageIconHeight, hoverColour } = props

  const CardContainer = styled.div`
    :hover {
      background: ${hoverColour};
    }
  `
  return (
    <div className={className}>
      {
        Array.isArray(cards) &&
        cards.map((card, index) =>
          <CardContainer className={cardContainerClassName} key={index}>
            <CardClass
              {...card}
              imageIconHeight={imageIconHeight}
              speciesIconHeight={speciesIconHeight}/>
          </CardContainer>
        )
      }
    </div>
  )
}

ResponsiveCardsRow.propTypes = {
  cards: PropTypes.arrayOf(PropTypes.shape(cardPropTypes)).isRequired,
  CardClass: PropTypes.func,
  className: PropTypes.string,
  cardContainerClassName: PropTypes.string,
  speciesIconHeight: PropTypes.string,
  imageIconHeight: PropTypes.string,
  hoverColour: PropTypes.string
}

ResponsiveCardsRow.defaultProps = {
  CardClass: Card,
  className: ``,
  cardContainerClassName: ``,
  speciesIconHeight: `6rem`,
  imageIconHeight: `2rem`,
  hoverColour: `AliceBlue`
}

export default ResponsiveCardsRow
