import React from 'react'
import PropTypes from 'prop-types'

const DemoComponent = ({title, message, footer}) =>
  <div>
    <h1>{title}</h1>
    <p>{message}</p>
    <small>{footer}</small>
  </div>

DemoComponent.propTypes = {
  title: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
  footer: PropTypes.string.isRequired
}

export default DemoComponent
