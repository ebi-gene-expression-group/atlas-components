import React from 'react'
import PropTypes from 'prop-types'
import EbiSpeciesIcon from 'react-ebi-species'

const SpeciesCard = ({iconSrc, description, content}) => {
  return (
    <div className={`column column-block text-center combo card`} style={{marginBottom:0, paddingBottom: `25px`}}>
      <span className={`species-icon`} style={{fontSize: `600%`}}>
        <EbiSpeciesIcon species={iconSrc}/>
      </span>

      {
        description && <h5 className={`species-name`}>{description}</h5>
      }

      {
        content &&
          <span className={`content`}>
            {
              content.map((item) =>
                item.url ?
                  <p id={`url`} style={{marginBottom: `5px`}} key={item.text}>
                    <a href={item.url} key={item.text}>{item.text}</a>
                  </p> :
                  <p id={`text`} style={{marginBottom: `5px`}} key={item.text}>{item.text}</p>
              )
            }
          </span>
      }
    </div>
  )
}

SpeciesCard.propTypes = {
  iconSrc: PropTypes.string.isRequired,
  description: PropTypes.string,
  content: PropTypes.arrayOf(PropTypes.shape({
    text: PropTypes.string.isRequired,
    url: PropTypes.string
  }))
}

export default SpeciesCard
