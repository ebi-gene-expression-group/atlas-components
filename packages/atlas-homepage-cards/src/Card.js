import React from 'react'
import PropTypes from 'prop-types'

import EbiSpeciesIcon from 'react-ebi-species'

import renderContentListItems from './renderContentListItems'
import modelPropTypes from './modelPropTypes'

const Card = ({iconType, iconSrc, description, content, speciesIconHeight, imageIconHeight}) => {
  const cardHero =
    iconType === `species` ?
      <span style={{fontSize: speciesIconHeight}}><EbiSpeciesIcon species={iconSrc}/></span> :
    // iconType === `image` ?  // Margin picked by trial and error to match EbiSpeciesIcon of size 8rem
      <img src={iconSrc} style={{height: imageIconHeight, marginBottom: `2.35rem`, marginTop: `2.50rem`}}/>

  return (
    <div style={{marginBottom:0, paddingBottom: `2rem`, textAlign: `center`}}>
      {
        description && description.url ?
          <a style={{borderBottom: 0}} href={description.url}>
            {cardHero}
          </a> :
          cardHero
      }

      {
        description &&
        <h5>
          {
            description.url ?
              <a href={description.url}>{description.text}</a> :
              description.text
          }
        </h5>
      }

      {
        Array.isArray(content) &&
        <ul style={{listStyle: `none`, marginLeft: 0}}>
          { renderContentListItems(content) }
        </ul>
      }
    </div>
  )
}

Card.propTypes = {
  ...modelPropTypes,
  speciesIconHeight: PropTypes.string,
  imageIconHeight: PropTypes.string
}

Card.defaultProps = {
  speciesIconHeight: `6rem`,
  imageIconHeight: `3rem`
}

export default Card
