import React from 'react'
import PropTypes from 'prop-types'
import { Table } from 'evergreen-ui'

const TableSortHeaderCell = ({columnNumber, headerText, width, orderedColumnIndex, ascendingOrder, onClick}) =>
  <Table.TextHeaderCell
    className={`header${columnNumber}`}
    flexBasis={width} flexShrink={100} flexGrow={100}
    onClick={() => onClick(columnNumber)}>
    <div>
      {headerText}
      { columnNumber === orderedColumnIndex ?
        ascendingOrder ?
          <i className={`icon icon-common icon-sort-up`} style={{paddingLeft: `1em`}}/> :
          <i className={`icon icon-common icon-sort-down`} style={{paddingLeft: `1em`}}/> :
        <i className={`icon icon-common icon-sort`} style={{paddingLeft: `1em`}}/>
      }
    </div>
  </Table.TextHeaderCell>

const TableSearchHeaderCell = ({columnNumber, headerText, width, searchedColumnIndex, searchQuery, onChange}) =>
  <Table.SearchHeaderCell
    className={`searchheader${columnNumber}`}
    flexBasis={width} flexShrink={100} flexGrow={100}
    onChange={value => onChange(value, columnNumber)}
    value={columnNumber===searchedColumnIndex ? searchQuery : ``}
    placeholder = {`Search by ${headerText} ...`}
  />

const tableHeaderCells = (tableHeader, searchedColumnIndex, searchQuery, orderedColumnIndex, ascendingOrder, onClick, onChange) => {
  return tableHeader.map((header, index) => {
    switch (header.type) {
    case `sort`:
      return (
        <TableSortHeaderCell
          {...{
            orderedColumnIndex,
            ascendingOrder,
            onClick
          }}
          key={`sortheader${index}`}
          columnNumber={index}
          headerText={header.title}
          width={header.width}
        />
      )
    case `search`:
      return (
        <TableSearchHeaderCell
          {...{
            searchedColumnIndex,
            searchQuery,
            onChange
          }}
          key={`searchheader${index}`}
          columnNumber={index}
          headerText={header.title}
          width={header.width}
        />
      )
    default:
      return (
        <Table.TextHeaderCell
          key={header.title}
          flexBasis={header.width}
          flexShrink={100}
          flexGrow={100}>
          {header.title}
        </Table.TextHeaderCell>
      )
    }}
  )
}

TableSearchHeaderCell.propTypes = {
  columnNumber: PropTypes.number.isRequired,
  headerText: PropTypes.string.isRequired,
  width: PropTypes.number.isRequired,
  searchedColumnIndex: PropTypes.number.isRequired,
  searchQuery: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired
}

TableSortHeaderCell.propTypes = {
  columnNumber: PropTypes.number.isRequired,
  headerText: PropTypes.string.isRequired,
  width: PropTypes.number.isRequired,
  orderedColumnIndex: PropTypes.number.isRequired,
  ascendingOrder: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired
}

export default tableHeaderCells
