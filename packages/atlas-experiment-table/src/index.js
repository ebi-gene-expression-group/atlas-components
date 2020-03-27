import React from 'react'
import PropTypes from 'prop-types'

import { BrowserRouter } from 'react-router-dom'

import TableManagerRoute from './TableManagerRoute'

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

export { default as TableManager } from './TableManager'
export { TableManagerRouter }
export { default as loadExperimentDownloadModule } from './download/ExperimentDownloadModule'
