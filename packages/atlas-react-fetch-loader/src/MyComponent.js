import React from 'react'
import PropTypes from 'prop-types'

class MyComponent extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return(
      <div className={`foo`}>Bar</div>      
    )
  }
}

MyComponent.propTypes = {
  atlasUrl: PropTypes.string
}

export default MyComponent
