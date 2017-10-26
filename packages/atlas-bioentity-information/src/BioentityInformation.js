import React from 'react'
import PropTypes from 'prop-types'

import BioentityProperty from './BioentityProperty';

class BioentityInformation extends React.Component {

    constructor(props) {
        super(props)
    }

  render() {
        return (
          <div className={`row`}>
              <table>
                  <tbody>
                  {this.props.bioentityProperties.map(function(bioentityProperty){
                      return (
                          <BioentityProperty
                              key={bioentityProperty.type}
                              {...bioentityProperty} />
                      )
                  })}
                  </tbody>
              </table>
          </div>
    )
  }
}

BioentityInformation.propTypes = {
    atlasUrl: PropTypes.string,
    bioentityProperties: PropTypes.array
}

export default BioentityInformation
