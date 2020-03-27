import React, { useState } from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash'

const ExperimentFileTypeMultiChoice = ({ fileTypes, onChange }) => {
  const [selectedFileTypes, setSelectedFileTypes] = useState(_.map(fileTypes, `id`))

  return (
    <ul style={{listStyle: `none`}}>
      {
        fileTypes.map((fileType, index) =>
          <li key={index}>
            <input
              id={fileType.id}
              type={`checkbox`}
              checked={selectedFileTypes.includes(fileType.id)}
              onChange={() => {
                const updatedSelectedFiletypes = _.xor(selectedFileTypes, [fileType.id])
                setSelectedFileTypes(updatedSelectedFiletypes)
                onChange(updatedSelectedFiletypes)
              }}/>
            <label htmlFor={fileType.id}>
              {fileType.description}
            </label>
          </li>
        )
      }
    </ul>
  )
}

ExperimentFileTypeMultiChoice.propTypes = {
  onChange: PropTypes.func.isRequired,
  fileTypes:
    PropTypes.arrayOf(
      PropTypes.shape(
        {
          description: PropTypes.string,
          id: PropTypes.string
        }
      )).isRequired
}

ExperimentFileTypeMultiChoice.defaultProps = {
  onChange: () => {}
}

export default ExperimentFileTypeMultiChoice
