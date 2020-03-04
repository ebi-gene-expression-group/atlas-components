import React from 'react'
import PropTypes from 'prop-types'

const DemoComponent = ({title, message, footer, renamedProp}) =>
  <div>
    <h1>{title}</h1>
    <p>{message}</p>
    <p>{renamedProp}</p>
    <small>{footer}</small>
  </div>

DemoComponent.propTypes = {
  title: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
  renamedProp: PropTypes.string.isRequired,
  footer: PropTypes.string.isRequired
}

DemoComponent.defaultProps = {
  renamedProp: `If you can read this, an error happened: this message should be overwritten with a renamed prop`
}

export default DemoComponent
