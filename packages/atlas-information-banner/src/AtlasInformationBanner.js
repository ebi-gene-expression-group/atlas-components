import React from 'react'
import PropTypes from 'prop-types'

class AtlasInformationBanner extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return(
      <div className={`foo`}><p>This is an information message</p></div>
    )
  }
}

AtlasInformationBanner.propTypes = {
  atlasUrl: PropTypes.string
}

export default AtlasInformationBanner
