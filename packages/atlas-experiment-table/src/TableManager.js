import React from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash'
import memoizeOne from 'memoize-one'

import { tableHeaderPropTypes, filterPropTypes } from './filterPropTypes'
import TablePreamble from './TablePreamble'
import TableContent from './TableContent'
import TableFooter from './TableFooter'

const capitalizeEachWord = str => str.replace(/\w+([\s-])*/g, _.capitalize)

export default class TableManager extends React.Component {
  static propTypes = {
    tableHeaders: PropTypes.arrayOf(tableHeaderPropTypes).isRequired,
    dropdownFilters: PropTypes.arrayOf(PropTypes.shape(filterPropTypes)).isRequired,
    dataRows: PropTypes.array.isRequired,
    sortColumnIndex: PropTypes.number,
    ascendingOrder: PropTypes.bool,
    host: PropTypes.string,
    rowSelectionColumn: PropTypes.shape({
      label: PropTypes.string.isRequired,
      dataKey: PropTypes.string.isRequired,
      tooltipContent: PropTypes.string,
      tableHeaderCellOnClick: PropTypes.func,
      width: PropTypes.number
    })
  }

  static defaultProps = {
    rowSelectionColumn: null,
    sortColumnIndex: 0,
    ascendingOrder: true,
    host: ``
  }

  constructor(props) {
    super(props)

    this.rowsPerPageOptions = [10, 50, 100]

    this.state = {
      sortColumnIndex: props.sortColumnIndex,
      ascendingOrder: props.ascendingOrder,
      currentPage: 1,
      rowsPerPage: this.rowsPerPageOptions[0],
      // Fields in the filters/headers *must not be* arrays or objects, so the spread creates good clones
      dropdownFiltersOptions:
        props.dropdownFilters.reduce((acc, dropdownFilter) => {
          acc[dropdownFilter.dataKey] =
            _.chain(props.dataRows)
              .flatMap(dropdownFilter.dataKey)
              .map(_.toString)
              .map(_.trim)
              .map(capitalizeEachWord)
              .uniq()
              .value()

          return acc
        },
        {}),
      searchAll: ``,
      filters:
        props.dropdownFilters.concat(props.tableHeaders).reduce((acc, filter) => {
          const trimmedValue = _.chain(filter.value).toString().trim().value()
          if (trimmedValue.length > 0) {
            acc[filter.dataKey] = trimmedValue
          }
          return acc
        },
        {}),
      selectedRows: []
    }

    this.filterSortDataRows = this.filterSortDataRows.bind(this)

    this.updateSelectedRows = this.updateSelectedRows.bind(this)
    this.updateFilters = this.updateFilters.bind(this)
    this.updateSearchAll = this.updateSearchAll.bind(this)
    this.updateRowsPerPage = this.updateRowsPerPage.bind(this)
    this.updateSortColumn = this.updateSortColumn.bind(this)
  }

  deepIncludesCaseInsensitive = (object, keys, value) =>
    _.chain(object)
      .pick(keys)
      .values()
      .flatten()
      .map(_.toString)
      .map(_.toLower)
      .some(valueToLower => valueToLower.includes(_.toString(value).toLowerCase()))
      .value()

  filterSortDataRows =
    memoizeOne((dataRows, filters, displayedKeys, searchAll, sortColumnDataKey, ascendingOrder) => {
      const filterSortedDataRows = _.chain(dataRows)
        .filter(
          // Keep the rows whose displayed columns match searchAll
          dataRow => this.deepIncludesCaseInsensitive(dataRow, displayedKeys, searchAll)
          // Keep the rows that have matching values defined in the filters (i.e. table headers and drop-downs)
          &&
          _.chain(filters)
            .keys()
            .every(filterKey => this.deepIncludesCaseInsensitive(dataRow, filterKey, filters[filterKey]))
            .value())
        // Sort by sortColumnDataKey
        .sortBy(
          // TODO Add a data type key to the header props to indicate if column values are strings, numbers, dates...
          sortColumnDataKey.toLowerCase().includes(`date`) ?
            dataRow => dataRow[sortColumnDataKey].split(`-`).reverse().join(``) :  // DD-MM-YYYY -> YYYYMMDD
            sortColumnDataKey)
        .value()

      if (!ascendingOrder) {
        filterSortedDataRows.reverse()
      }

      return filterSortedDataRows
    },
    _.isEqual)

  updateSelectedRows(rowId) {
    this.setState({
      selectedRows:
        _.chain(this.state.selectedRows)
          .cloneDeep()
          .xor([rowId])
          .value()
    })
  }

  // Filters are pairs of key-value that are searched for in the dataRows prop
  updateFilters(dataKey, value) {
    this.setState({
      filters:
        _.chain(this.state.filters)
          .omit(dataKey)  // Returns new object, this.state.filters isn’t mutated, can _.cloneDeep if needed though
          .assign(
            // An empty string means the filter has been deleted from the table header or All has been selected in a
            // dropdown, so we add no keys to the filters object
            value.trim() === `` ? {} : { [dataKey]: value })
          .value(),
      currentPage: 1
    })
  }

  updateSearchAll(searchString) {
    this.setState({
      searchAll: searchString,
      currentPage: 1
    })
  }

  // Setting rowsPerPage to 0 shows all rows, see render below
  updateRowsPerPage(rowsPerPage) {
    this.setState({
      rowsPerPage: rowsPerPage,
      currentPage: 1
    })
  }

  // If the columnIndex is the same we flip the order between ascending/descending
  updateSortColumn(columnIndex) {
    this.setState({
      sortColumnIndex: columnIndex,
      ascendingOrder: this.state.sortColumnIndex === columnIndex ? !this.state.ascendingOrder : true
    })
  }

  render() {
    const filteredSortedDataRows =
      this.filterSortDataRows(
        this.props.dataRows,
        this.state.filters,
        this.props.tableHeaders.map(tableHeader => tableHeader.dataKey),
        this.state.searchAll,
        this.props.tableHeaders.length > 0 ? this.props.tableHeaders[this.state.sortColumnIndex].dataKey : ``,
        this.state.ascendingOrder)

    const { rowsPerPage, currentPage } = this.state
    const currentPageDataRows = rowsPerPage ?
      filteredSortedDataRows.slice(rowsPerPage * (currentPage - 1), rowsPerPage * currentPage) :
      filteredSortedDataRows

    return (
      <React.Fragment>
        <TablePreamble
          dropdowns={this.props.dropdownFilters.map(dropdownFilter => ({
            ...dropdownFilter,
            options: this.state.dropdownFiltersOptions[dropdownFilter.dataKey]
          }))}
          dropdownOnChange={this.updateFilters}
          rowsCount={this.props.dataRows.length}
          rowsPerPageOptions={this.rowsPerPageOptions}
          rowsPerPage={this.state.rowsPerPage}
          rowsPerPageOnChange={this.updateRowsPerPage}
          searchAll={this.state.searchAll}
          searchAllOnChange={this.updateSearchAll}/>

        <TableContent
          dataRows={currentPageDataRows}
          tableHeaders={this.props.tableHeaders}
          filters={this.state.filters}
          tableHeaderCellOnChange={this.updateFilters}
          sortColumnIndex={this.state.sortColumnIndex}
          ascendingOrder={this.state.ascendingOrder}
          tableHeaderCellOnClick={this.updateSortColumn}
          rowSelectionColumn={this.props.rowSelectionColumn}
          selectedRows={this.state.selectedRows}
          host={this.props.host}
          selectOnChange={this.updateSelectedRows}/>

        <TableFooter
          dataRowsLength={this.props.dataRows.length}
          filteredDataRowsLength={filteredSortedDataRows.length}
          currentPage={this.state.currentPage}
          rowsPerPage={this.state.rowsPerPage}
          onChange={i => this.setState({ currentPage: i })}/>
      </React.Fragment>
    )
  }
}
