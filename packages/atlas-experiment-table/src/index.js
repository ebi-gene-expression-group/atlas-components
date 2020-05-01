import React from 'react'
import PropTypes from 'prop-types'

import { BrowserRouter } from 'react-router-dom'

import TableManagerRoute from './TableManagerRoute'
import validateAndDownloadExperimentFiles from './download/validateAndDownloadExperimentFiles'

const TableManagerRouter = (props) =>
  <BrowserRouter basename={props.basename}>
    <TableManagerRoute {...props}/>
  </BrowserRouter>

TableManagerRouter.propTypes = {
  basename: PropTypes.string
}

TableManagerRouter.defaultProps = {
  basename: ``
}

const _validateAndDownloadExperimentFiles = host =>
  experimentAccessions => validateAndDownloadExperimentFiles(host, experimentAccessions, [])


export { default as TableManager } from './TableManager'
export { TableManagerRouter }
export { default as loadExperimentDownloadModule } from './download/ExperimentDownloadModule'
export { _validateAndDownloadExperimentFiles }
