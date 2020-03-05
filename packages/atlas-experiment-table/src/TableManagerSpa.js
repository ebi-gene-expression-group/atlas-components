import React from 'react'
import PropTypes from 'prop-types'

import { BrowserRouter } from 'react-router-dom'

import TableManagerRoute from './TableManagerRoute'

const TableManagerSpa = (props) =>
  <BrowserRouter basename={props.basename}>
    <TableManagerRoute {...props}/>
  </BrowserRouter>

TableManagerSpa.propTypes = {
  basename: PropTypes.string
}

TableManagerSpa.defaultProps = {
  basename: ``
}

export default TableManagerSpa
