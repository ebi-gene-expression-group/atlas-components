import React from 'react'
import PropTypes from 'prop-types'
import styled, { createGlobalStyle } from 'styled-components'

import cardPropTypes from './modelPropTypes'
import Card from './Card'
import Slide from 'react-slick'

const CarouselCardsRow = (props) => {
  const { CardClass, cards, slideSettings } = props
  const { className, cardContainerClassName, speciesIconHeight, imageIconHeight, hoverColour } = props
  const disableSlide = slideSettings.slidesToShow >= cards.length
  slideSettings.slidesToShow = disableSlide ? cards.length : slideSettings.slidesToShow

  const CardContainer = styled.div`
    :hover {
      background: ${hoverColour};
    }
  `

  const SlideGlobalStyle = createGlobalStyle`
    .slick-slide img {
      margin: auto;
    }
    .slick-prev:before, .slick-next:before  {
      font-size: 25px !important;
    }
    .slick-prev {
      left: -24px;
    }
    .slick-next {
      right: -20px;
    }
    .slick-slider {
      height: 300px;
    }
    .slick-prev:before {
      color: #3497c5;
    }
    .slick-next:before{
      color: #3497c5;
    }
    .slick-prev:hover {
      color: #2f5767;
    }
    .slick-next:hover{
      color: #2f5767;
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
    <div className={className}>
      {disableSlide ? cardsDisplay :
        [
          <SlideGlobalStyle key={`slidestyle`}/>,
          <Slide key={`slidecontent`}
            {...slideSettings}>
            {cardsDisplay}
          </Slide>
        ]
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
  slideSettings: PropTypes.object
}

CarouselCardsRow.defaultProps = {
  CardClass: Card,
  className: ``,
  cardContainerClassName: ``,
  speciesIconHeight: `6rem`,
  imageIconHeight: `2rem`,
  hoverColour: `AliceBlue`,
  slideSettings: {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 6,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000
  }
}

export default CarouselCardsRow
