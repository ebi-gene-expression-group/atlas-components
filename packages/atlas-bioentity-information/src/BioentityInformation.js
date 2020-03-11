import React from 'react'
import PropTypes from 'prop-types'

import BioentityProperty from './BioentityProperty'

const BioentityInformation = ({ className, bioentityProperties }) =>
  <div className={className}>
    <table className={`hover`}>
      <tbody>
        {
          bioentityProperties.map((property, index) =>
            <tr key={index}>
              <th style={{whiteSpace: `nowrap`}}>
                {property.name}
              </th>
              <td>
                <BioentityProperty {...property} />
              </td>
            </tr>
          )
        }
      </tbody>
    </table>
  </div>

BioentityInformation.propTypes = {
  className: PropTypes.string,
  bioentityProperties: PropTypes.array
}

BioentityInformation.defaultProps = {
  className: `row column expanded`
}

export default BioentityInformation
