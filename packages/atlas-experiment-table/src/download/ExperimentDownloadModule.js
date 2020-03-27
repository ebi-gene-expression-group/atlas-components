import React from 'react'
import ReactDOM from 'react-dom'

import Popup from 'react-popup'
import ExperimentFileTypeMultiChoice from './ExperimentFileTypeMultiChoice'
import ReactPopupStyle from './ReactPopupStyle'

import validateAndDownloadExperimentFiles from './validateAndDownloadExperimentFiles'

export default (host, fileTypes, target) => {
  // Render Popup component with some styling, it won’t be visible just yet
  ReactDOM.render(
    <React.Fragment>
      <ReactPopupStyle />
      <Popup />
    </React.Fragment>,
    document.getElementById(target))

  // Register the `prompt` plugin
  Popup.registerPlugin(
    `prompt`,
    experimentAccessions => {
      let selectedFileTypeIds = fileTypes.map(fileType => fileType.id)
      const setSelectedFileTypeIds = fileTypeIds => selectedFileTypeIds = fileTypeIds

      Popup.create({
        title: null,
        content:
          <ExperimentFileTypeMultiChoice
            fileTypes={fileTypes}
            onChange={setSelectedFileTypeIds}/>,
        buttons: {
          left: [{
            text: `Cancel`,
            key: `esc`,
            action: () => {
              Popup.close()
            }
          }],
          right:
            [{
              text: `Download`,
              className: `success`,
              key: `enter`,
              action: () => {
                if (selectedFileTypeIds.length) {
                  validateAndDownloadExperimentFiles(host, experimentAccessions, selectedFileTypeIds)
                  Popup.close()
                }
              }
            }]
        }
      })
    }
  )

  // Return a function that makes the pop-up visible
  return checkedRows => Popup.plugins().prompt(checkedRows)
}
