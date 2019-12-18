import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import Slider from 'react-slick'

import cardPropTypes from '../modelPropTypes'
import Card from '../Card'

import { SlickStyle, SlickThemeStyle } from './SlickGlobalStyles'

const CarouselCardsRow = (props) => {
  const { CardClass, cards, sliderSettings, containerHeight, sliderHeight } = props
  const { className, cardContainerClassName, speciesIconHeight, imageIconHeight, hoverColour} = props

  const disableSlider = sliderSettings.slidesToShow >= cards.length
  sliderSettings.slidesToShow = disableSlider ? cards.length : sliderSettings.slidesToShow

  const CardContainer = styled.div`
    :hover {
      background: ${hoverColour};
    }
  `

  const cardsDisplay = Array.isArray(cards) && cards.map((card, index) =>
    <CardContainer className={cardContainerClassName} key={index}>
      <CardClass
        {...card}
        imageIconHeight={imageIconHeight}
        speciesIconHeight={speciesIconHeight}/>
    </CardContainer>)

  return (
    <div className={className} style={{height: containerHeight}}>
      {disableSlider ? cardsDisplay :
        <React.Fragment>
          <SlickStyle sliderHeight={sliderHeight}/>
          <SlickThemeStyle/>
          <Slider
            {...sliderSettings}>
            {cardsDisplay}
          </Slider>
        </React.Fragment>
      }
    </div>
  )
}

CarouselCardsRow.propTypes = {
  cards: PropTypes.arrayOf(PropTypes.shape(cardPropTypes)).isRequired,
  CardClass: PropTypes.func,
  className: PropTypes.string,
  cardContainerClassName: PropTypes.string,
  speciesIconHeight: PropTypes.string,
  imageIconHeight: PropTypes.string,
  hoverColour: PropTypes.string,
  sliderSettings: PropTypes.object.isRequired,
  //To prevent species summary panel's bottom border move up/down when tabs change.
  containerHeight: PropTypes.string,
  //To prevent slick-slider's bottom dots move up/down when tabs change as adaptiveHeight is applied.
  sliderHeight: PropTypes.string
}

CarouselCardsRow.defaultProps = {
  CardClass: Card,
  className: ``,
  cardContainerClassName: ``,
  speciesIconHeight: `6rem`,
  imageIconHeight: `2rem`,
  hoverColour: `AliceBlue`,
  containerHeight: ``,
  sliderHeight: ``
}

export default CarouselCardsRow
