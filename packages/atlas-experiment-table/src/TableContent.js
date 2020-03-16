import React from 'react'
import PropTypes from 'prop-types'

// We’re not using Link because Evergreen restyles the links and we want EBI VF for that
import { Table, majorScale } from 'evergreen-ui'
import { tableHeaderPropTypes } from './filterPropTypes'

import TableHeaderCell from './head/TableHeaderCell'
import SelectionTableHeaderCell from './head/SelectionTableHeaderCell'
import { _validateAndDownloadExperimentFiles } from './head/downloadHelper'

import TableCell from './TableCell'
import SelectionTableCell from './SelectionTableCell'

// Minimum width of the large size in EBI VF
const ebiVfLargeMinWidth = 1024

const TableContent =
  ({
    // Presentational props
    dataRows, tableHeaders,
    // Filter handling
    filters, tableHeaderCellOnChange,
    // Ordering
    sortColumnIndex, ascendingOrder, tableHeaderCellOnClick,
    // Row selection and action on selected rows
    downloadFileTypes, rowSelectionColumn, selectedRows, host, selectOnChange,
    className
  }) =>
    <React.Fragment>
      <div className={className}>
        <Table
          minWidth={ebiVfLargeMinWidth}
          border>

          <Table.Head
            height={majorScale(6)}
            paddingRight={0}>
            {
              tableHeaders.map((tableHeader, index) =>
                <TableHeaderCell
                  key={index}
                  {...tableHeader}
                  value={filters[tableHeader.dataKey] || ``}
                  columnIndex={index}
                  sortColumnIndex={sortColumnIndex}
                  ascendingOrder={ascendingOrder}
                  onClick={tableHeaderCellOnClick}
                  onChange={tableHeaderCellOnChange}/>
              )
            }
            {
              rowSelectionColumn &&
              <SelectionTableHeaderCell
                {...rowSelectionColumn}
                downloadFileTypes={downloadFileTypes}
                selectedRowIds={selectedRows}
                onClick={rowSelectionColumn.tableHeaderCellOnClick || _validateAndDownloadExperimentFiles(host)}/>
            }
          </Table.Head>

          <Table.Body>
            {
              dataRows.map((dataRow, index) =>
                <Table.Row
                  key={index}
                  height={`auto`}
                  backgroundColor={index % 2 === 0 ? `white`:`whiteSmoke`}>
                  {[
                    tableHeaders.map((tableHeader, index) =>
                      <TableCell
                        key={index}
                        dataRow={dataRow}
                        dataKey={tableHeader.dataKey}
                        image={tableHeader.image}
                        host={host}
                        linkTo={tableHeader.linkTo}
                        width={tableHeader.width}/>
                    ),

                    rowSelectionColumn &&
                    <SelectionTableCell
                      key={tableHeaders.length + 1}
                      dataRow={dataRow}
                      dataKey={rowSelectionColumn.dataKey}
                      selectedRowIds={selectedRows}
                      onChange={selectOnChange}
                      width={rowSelectionColumn.width}/>
                  ]}
                </Table.Row>
              )
            }
          </Table.Body>

        </Table>
      </div>
    </React.Fragment>

TableContent.propTypes = {
  // Presentational props
  dataRows: PropTypes.arrayOf(PropTypes.object).isRequired,
  tableHeaders: PropTypes.arrayOf(tableHeaderPropTypes),
  // Filter handling
  filters: PropTypes.object.isRequired,
  tableHeaderCellOnChange: PropTypes.func.isRequired,
  // Ordering
  sortColumnIndex: PropTypes.number.isRequired,
  ascendingOrder: PropTypes.bool.isRequired,
  tableHeaderCellOnClick: PropTypes.func.isRequired,
  // Row selection and action on selected rows
  downloadFileTypes: PropTypes.arrayOf(
    PropTypes.shape({
      description: PropTypes.string,
      id: PropTypes.string
    })
  ),
  rowSelectionColumn: PropTypes.shape({
    label: PropTypes.string.isRequired,
    dataKey: PropTypes.string.isRequired,
    tableHeaderCellOnClick: PropTypes.func,
    tooltipContent: PropTypes.string,
    width: PropTypes.number
  }),
  selectedRows: PropTypes.arrayOf(PropTypes.string).isRequired,
  host: PropTypes.string,
  selectOnChange: PropTypes.func.isRequired,
  className: PropTypes.string
}

TableContent.defaultProps = {
  host: ``,
  className: `small-12 columns`
}

export default TableContent
