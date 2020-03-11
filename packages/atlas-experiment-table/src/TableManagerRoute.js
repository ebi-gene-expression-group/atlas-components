import React from 'react'
import PropTypes from 'prop-types'
import { Route, useLocation, useHistory } from 'react-router-dom'

import URI from 'urijs'

import TableManager from './TableManager'

const updateUrl = (filters, location, history) => {
  history.push(new URI(location.pathname).search(filters).toString())
}

const TableManagerRoute = (props) => {
  const location = useLocation()
  const history = useHistory()

  const searchObject = URI.parseQuery(location.search)
  
  const populatedTableHeaders = props.tableHeaders.map(
    tableHeader => ({ ...tableHeader, value: searchObject[tableHeader.dataKey] }))

  const populatedDropdownFilters = props.dropdownFilters.map(
    dropdownFilter => ({ ...dropdownFilter, value: searchObject[dropdownFilter.dataKey] }))

  return (
    <Route exact path={props.path}>
      <TableManager
        {...props}
        tableHeaders={populatedTableHeaders}
        dropdownFilters={populatedDropdownFilters}
        afterStateUpdate={filters => updateUrl(filters, location, history)}/>
    </Route>
  )
}

TableManagerRoute.propTypes = {
  ...TableManager.propTypes,
  path: PropTypes.string
}

TableManagerRoute.defaultProps = {
  path: `/experiments`
}

export default TableManagerRoute
