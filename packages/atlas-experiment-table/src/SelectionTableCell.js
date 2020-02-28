import React from 'react'
import PropTypes from 'prop-types'

import { Table, Checkbox } from 'evergreen-ui'

const SelectionTableCell = ({ dataRow, dataKey, selectedRowIds, onChange, width }) =>
  <Table.Cell justifyContent={`center`} flexGrow={width}>
    <Checkbox
      checked={selectedRowIds.includes(dataRow[dataKey])}
      onChange={() => onChange(dataRow[dataKey])}/>
  </Table.Cell>

SelectionTableCell.propTypes = {
  dataRow: PropTypes.object.isRequired,
  dataKey: PropTypes.string.isRequired,
  selectedRowIds: PropTypes.arrayOf(PropTypes.string).isRequired,
  onChange: PropTypes.func,
  width: PropTypes.number
}

SelectionTableCell.defaultProps = {
  width: 1
}

export default SelectionTableCell
