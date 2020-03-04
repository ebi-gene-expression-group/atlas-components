import React from 'react'
import PropTypes from 'prop-types'

import { Table, SearchInput, Heading, Pane, Icon, majorScale } from 'evergreen-ui'

const TableHeaderCell =
({
  label, dataKey,
  width, searchable, value, onChange, sortable, columnIndex, sortColumnIndex, ascendingOrder, onClick
}) =>
  <Table.HeaderCell
    flexGrow={width}
    cursor={sortable ? searchable ? `auto` : `pointer` : `auto`}>
    {
      searchable ?
        <SearchInput
          size={500}
          width={`100%`}
          placeholder={`${label}`}
          border={`muted`}
          value={value}
          onChange={e => onChange(dataKey, e.target.value)}/> :
        <Heading
          size={500}
          onClick={sortable ? () => onClick(columnIndex) : () => {}}>
          {label}
        </Heading>
    }
    {
      sortable &&
      <Pane paddingLeft={majorScale(1)}>
        <Icon
          icon={columnIndex === sortColumnIndex ? ascendingOrder ? `sort-asc` : `sort-desc` : `sort`}
          onClick={() => onClick(columnIndex)}
          cursor={`pointer`}/>
      </Pane>
    }
  </Table.HeaderCell>

TableHeaderCell.propTypes = {
  label: PropTypes.string.isRequired,
  // Even though dataKey isn’t used when a plain header cell is created, it’s necessary to have it or the corresponding
  // field won’t be shown for this column
  dataKey: PropTypes.string.isRequired,
  width: PropTypes.number,
  searchable: PropTypes.bool,
  value: PropTypes.string,
  onChange: PropTypes.func,
  sortable: PropTypes.bool,
  columnIndex: PropTypes.number,
  sortColumnIndex: PropTypes.number,
  ascendingOrder: PropTypes.bool,
  onClick: PropTypes.func
}

TableHeaderCell.defaultProps = {
  width: 1,
  searchable: false,
  value: null,
  onChange: () => {},
  sortable: false,
  columnIndex: 0,
  sortColumnIndex: 0,
  ascendingOrder: false,
  onClick: () => {}
}

export default TableHeaderCell
