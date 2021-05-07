import React from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash'

import { tableHeaderPropTypes, filterPropTypes } from './filterPropTypes'
import TablePreamble from './TablePreamble'
import TableContent from './TableContent'
import TableFooter from './TableFooter'

import search from './search'

const capitalizeEachWord = str => str.replace(/\w+([\s-])*/g, _.capitalize)

const filterSortDataRows = (dataRows, filters, displayedKeys, searchAll, sortColumnDataKey, ascendingOrder) => {
  const filterSortedDataRows = _.chain(dataRows)
    .filter(
      // Keep the rows whose displayed columns match searchAll
      dataRow => search(dataRow, displayedKeys, searchAll)
      // Keep the rows that have matching values defined in the filters (i.e. table headers and drop-downs)
      &&
      _.chain(filters)
        .keys()
        .every(filterKey => search(dataRow, filterKey, filters[filterKey]))
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
}

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
    }),
    className: PropTypes.string,
    afterStateUpdate: PropTypes.func
  }

  static defaultProps = {
    sortColumnIndex: 0,
    ascendingOrder: true,
    host: ``,
    rowSelectionColumn: null,
    className: `row expanded`,
    afterStateUpdate: () => {}
  }

  constructor(props) {
    super(props)

    this.rowsPerPageOptions = [10, 50, 100]

    // Build filters from dropdowns and table headers value fields
    const filters =
      _.chain([ ...props.tableHeaders, ...props.dropdownFilters ])
        .map(doh => ({ ...doh, value: _.chain(doh.value).trim().value() }))
        .filter(`value`)
        .reduce((acc, doh) => {
          acc[doh.dataKey]= doh.value
          return acc
        }, {})
        .value()

    this.state = {
      sortColumnIndex: props.sortColumnIndex,
      ascendingOrder: props.ascendingOrder,
      currentPage: 1,
      rowsPerPage: this.rowsPerPageOptions[0],
      // Fields in the filters/headers *must not be* arrays or objects, so the spread creates good clones
      dropdownFilters:
        props.dropdownFilters.map(dropdownFilter => ({
          ...dropdownFilter,
          options:
            _.chain(props.dataRows)
              .flatMap(dropdownFilter.dataKey)
              .map(_.toString)
              .map(_.trim)
              .map(capitalizeEachWord)
              .uniq()
              .value()
        }))
      ,
      searchAll: ``,
      filters: filters,
      selectedRows: [],
      filteredSortedDataRows: []
    }

    const doFilterAndSort = () =>
      filterSortDataRows(
        this.props.dataRows,
        this.state.filters,
        this.props.tableHeaders.map(tableHeader => tableHeader.dataKey),
        this.state.searchAll,
        this.props.tableHeaders.length > 0 ? this.props.tableHeaders[this.state.sortColumnIndex].dataKey : ``,
        this.state.ascendingOrder)

    this.state.filteredSortedDataRows = doFilterAndSort()

    this.immediateFilterAndSort = () =>
      this.setState(
        { filteredSortedDataRows: doFilterAndSort() },
        () => this.props.afterStateUpdate(this.state.filters))
    this.debouncedFilterAndSort = _.debounce(this.immediateFilterAndSort, 600)

    this.updateSelectedRows = this.updateSelectedRows.bind(this)
    this.updateFilters = this.updateFilters.bind(this)
    this.updateSearchAll = this.updateSearchAll.bind(this)
    this.updateRowsPerPage = this.updateRowsPerPage.bind(this)
    this.updateSortColumn = this.updateSortColumn.bind(this)
  }

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
  updateFilters(dataKey, value, debounce = true) {
    const newFilters =
      _.chain(this.state.filters)
        .omit(dataKey)  // Returns new object, this.state.filters isn’t mutated, can _.cloneDeep if needed though
        .assign(
          // An empty string means the filter has been deleted from the table header or All has been selected in a
          // dropdown, so we add no keys to the filters object
          value.trim() === `` ? {} : { [dataKey]: value })
        .value()

    const newDropdownFilters =
      _.chain(this.state.dropdownFilters)
        .cloneDeep()
        .map(dropdownFilter => ({
          ...dropdownFilter,
          value: dropdownFilter.dataKey === dataKey ? value : ``
        }))
        .value()

    this.setState(
      {
        filters: newFilters,
        dropdownFilters: newDropdownFilters,
        currentPage: 1
      },
      debounce ? this.debouncedFilterAndSort : this.immediateFilterAndSort
    )
  }

  updateSearchAll(searchString) {
    this.setState(
      {
        searchAll: searchString,
        currentPage: 1
      },
      this.debouncedFilterAndSort
    )
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
    this.setState(
      {
        sortColumnIndex: columnIndex,
        ascendingOrder: this.state.sortColumnIndex === columnIndex ? !this.state.ascendingOrder : true
      },
      () => this.immediateFilterAndSort()
    )
  }

  componentDidUpdate(previousProps) {
    if (previousProps.dataRows !== this.props.dataRows) {
      this.setState(
          {
            filteredSortedDataRows: filterSortDataRows(
                this.props.dataRows,
                this.state.filters,
                this.props.tableHeaders.map(tableHeader => tableHeader.dataKey),
                this.state.searchAll,
                this.props.tableHeaders.length > 0 ? this.props.tableHeaders[this.state.sortColumnIndex].dataKey : ``,
                this.state.ascendingOrder)
          }
      )
    }
  }

  render() {
    const { rowsPerPage, currentPage } = this.state
    const currentPageDataRows = rowsPerPage ?
      this.state.filteredSortedDataRows.slice(rowsPerPage * (currentPage - 1), rowsPerPage * currentPage) :
      this.state.filteredSortedDataRows

    return (
      <div className={this.props.className}>
        <TablePreamble
          dropdowns={this.state.dropdownFilters}
          dropdownOnChange={this.updateFilters}
          rowsCount={this.state.filteredSortedDataRows.length}
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
          filteredDataRowsLength={this.state.filteredSortedDataRows.length}
          currentPage={this.state.currentPage}
          rowsPerPage={this.state.rowsPerPage}
          onChange={i => this.setState({ currentPage: i })}/>
      </div>
    )
  }
}
