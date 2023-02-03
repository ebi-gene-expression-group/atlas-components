import React from 'react'
import PropTypes from 'prop-types'

function SearchExamples (props) {
  return (
    <p style={{ fontSize: `smaller` }}>Examples:
      {
        props.links.map(
          (link, index) =>
            <span key={index}>
              {index === 0 && ` `}<a href={link.url}>{link.text}</a>{index < props.links.length - 1 && `, `}
            </span>)
      }
    </p>
  )
}

SearchExamples.propTypes = {
  links: PropTypes.arrayOf(PropTypes.shape({
    text: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired
  })).isRequired
}

export default SearchExamples
