import React from 'react'
import PropTypes from 'prop-types'

import BioentityProperty from './BioentityProperty';

class BioentityInformation extends React.Component {

    constructor(props) {
        super(props)
    }

  render() {
        return (
          <div className={`row row-padding small-12`}>
              <ul className={`accordion`} data-accordion data-allow-all-closed="true">
                  <li className={`accordion-item`} data-accordion-item>
                      <a href="#geneInfo" className={`accordion-title`} style={{fontSize: '1.1rem'}}>Gene Information</a>
                      <div id="geneInfo" className={`accordion-content`} data-tab-content>

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
                  </li>
              </ul>
          </div>
    )
  }
}

BioentityInformation.propTypes = {
    atlasUrl: PropTypes.string,
    bioentityProperties: PropTypes.array
}

export default BioentityInformation
