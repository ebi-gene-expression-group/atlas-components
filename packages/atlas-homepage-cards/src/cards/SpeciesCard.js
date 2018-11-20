import React from 'react'
import PropTypes from 'prop-types'
import EbiSpeciesIcon from 'react-ebi-species'

import renderContentListItems from './renderContentListItems'
import cardPropTypes from './cardPropTypes'

const SpeciesCard = ({iconSrc, description, content}) =>
  <div style={{marginBottom:0, paddingBottom: `2rem`, textAlign: `center`}}>
    {
      description && description.url ?
        <a style={{fontSize: `6rem`, borderBottom: 0}} href={description.url}>
          <EbiSpeciesIcon species={iconSrc}/>
        </a> :
        <span style={{fontSize: `6rem`}}>
          <EbiSpeciesIcon species={iconSrc}/>
        </span>
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
        {renderContentListItems(content)}
      </ul>
    }
  </div>

SpeciesCard.propTypes = cardPropTypes

export default SpeciesCard
