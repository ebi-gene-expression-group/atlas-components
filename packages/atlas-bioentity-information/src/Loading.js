import React from 'react'
import PropTypes from 'prop-types'

import URI from 'urijs'

const Loading = (props) => {
  if(!props.loading) {
    return null
  }

  return (
    <div className={`text-center`}>
      <img className={`small-centered`} src={URI(require(`./images/flask-loader.svg`), props.resourcesUrl).toString()} />
    </div>
  )
}

Loading.propTypes = {
  loading: PropTypes.bool.isRequired,
  resourcesUrl: PropTypes.string
}

Loading.defaultProps = {
  resourcesUrl: ``
}

export default Loading