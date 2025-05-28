import React from 'react'
import PropTypes from 'prop-types'

import Linkify from 'linkifyjs/react'

const AnalysisMethodsTable = ({data, sectionName}) =>
  <div>
    <h3>{sectionName}</h3>
    <table>
      <thead>
        <tr>
          {data[0].map((element, index) => <th key={index}>{element}</th>)}
        </tr>
      </thead>
      <tbody>
        {
          data.slice(1, data.length).map((row, index) =>
            <tr key={index}>
              {row.map((element, index) =>
                <td key={index}>
                  <Linkify>{element}</Linkify>
                </td>
              )}
            </tr>
          )
        }
      </tbody>
    </table>
  </div>

AnalysisMethodsTable.propTypes = {
  data: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.string)).isRequired,
  sectionName: PropTypes.string.isRequired
}

export default AnalysisMethodsTable
