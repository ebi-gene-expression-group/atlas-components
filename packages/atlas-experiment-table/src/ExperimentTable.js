import React from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash'

import { tableHeaderPropTypes } from './TableHeaderPropTypes'
import TableFooter from './TableFooter'
import TableSearchHeader from './TableSearchHeader'
import TableContent from './TableContent'

class ExperimentTable extends React.Component {
  constructor(props) {
    super(props)
    this.entriesPerPageOptions = [10, 25, 50]
    this.state = {
      searchQuery: ``,
      orderedColumnIndex: 0,
      searchedColumnIndex: 1,
      ascendingOrder: false,
      checkedRows: [],
      currentPage: 1,
      entriesPerPage: this.entriesPerPageOptions[0],
      selectedSearch: ``,
      dropdownFilters: props.dropdownFilters.map(filter => ({
        dataParam: filter.dataParam,
        label: filter.label,
        options: _.chain(props.experiments).flatMap(filter.dataParam.trim()).uniq().value()
      })),
      selectedFilters: props.selectedFilters.map(selectedFilter => ({
        dataParam: selectedFilter.dataParam,
        value: selectedFilter.value
      }))
    }

    this.sort = this.sort.bind(this)
    this.filter = this.filter.bind(this)
    this.containsValue = this.containsValue.bind(this)
    this.filterOnChange = this.filterOnChange.bind(this)
    this.searchAllOnChange = this.searchAllOnChange.bind(this)
    this.numberOfEntriesPerPageOnChange = this.numberOfEntriesPerPageOnChange.bind(this)

    this.handleCheckbox = this.handleCheckbox.bind(this)
    this.tableHeaderOnChange = this.tableHeaderOnChange.bind(this)
    this.tableHeaderOnClick = this.tableHeaderOnClick.bind(this)
  }

  sort(data) {
    const reverseDateRepresentation = date => {
      let parts = date.split(`-`)
      return `${parts[2]}-${parts[1]}-${parts[0]}`
    }
    const {ascendingOrder, orderedColumnIndex} = this.state
    const propKey = this.props.tableHeader[orderedColumnIndex].dataParam
    const sortedAscendingElements = propKey === `lastUpdate` ?
      _.sortBy(data, (o) => reverseDateRepresentation(o[propKey])) :
      _.sortBy(data, propKey)
    return ascendingOrder ? sortedAscendingElements : sortedAscendingElements.reverse()
  }

  filter(data, tableHeader) {
    const searchQuery = this.state.searchQuery.trim()
    return searchQuery.length === 0 ? data :
      data.filter(row => Array.isArray(row[tableHeader[this.state.searchedColumnIndex].dataParam]) ?
        _.flattenDeep(row[tableHeader[this.state.searchedColumnIndex].dataParam])
          .some(item => item.toLowerCase().includes(searchQuery.toLowerCase()))
        :
        row[tableHeader[this.state.searchedColumnIndex].dataParam].toString().toLowerCase()
          .includes(searchQuery.toLowerCase())
      )
  }

  // Deep-search enumerable property values in object
  // > containsValue({a: 1, b: 2}, 1)
  // true
  // > containsValue({a: { b: { c: `foo`, d: { x: 1, y: 2, z: 3 }, e: `bar` } } }, 3)
  // true
  containsValue(jsonObject, value) {
    return Object.keys(jsonObject).some(key =>
      typeof jsonObject[key] === `object` ?
        this.containsValue(jsonObject[key], value) :
        jsonObject[key] === value
    )
  }

  handleCheckbox(accession) {
    const checkedArray = this.state.checkedRows.includes(accession) ?
      this.state.checkedRows.filter(e => e !== accession) :
      this.state.checkedRows.concat(accession)

    this.setState({checkedRows: checkedArray})
  }

  // Filters are pairs of key-value that are searched for in the experiments prop
  filterOnChange(e, dataParam, label) {
    this.setState({
      selectedFilters:
        _.chain(this.state.selectedFilters)
          .cloneDeep()
          .reject({ dataParam: dataParam })
          .concat(
            e.target.value === `` ?
              // An empty string means the filter has been deleted from the table header or All has been selected in a
              // dropdown, so we remove it by leaving the cloned array without the dataParam unmodified
              [] :
              [{
                dataParam: dataParam,
                label: label,
                value: e.target.value
              }])
          .value()
    })
  }

  searchAllOnChange(e) {
    this.setState({
      selectedSearch: e.target.value.toLowerCase(),
      currentPage: 1
    })
  }

  numberOfEntriesPerPageOnChange(e) {
    this.setState({
      entriesPerPage: e.target.value,
      currentPage: 1
    })
  }

  tableHeaderOnClick(columnNumber) {
    this.setState({
      orderedColumnIndex: columnNumber,
      ascendingOrder: !this.state.ascendingOrder
    })
  }

  tableHeaderOnChange(value, columnNumber) {
    this.setState({
      searchQuery: value,
      searchedColumnIndex: columnNumber
    })
  }

  render() {
    const { searchQuery, searchedColumnIndex, selectedSearch, checkedRows } = this.state
    const { selectedFilters, dropdownFilters } = this.state
    const { orderedColumnIndex, ascendingOrder } = this.state
    const { entriesPerPage, currentPage } = this.state
    const { host, experiments, tableHeader, enableDownload, downloadTooltip } = this.props

    const displayedFields = tableHeader.map(header => header.dataParam)

    const filteredExperiments =
      // First we filter experiments according to table headers...
      this.filter(this.sort(experiments), tableHeader)
      // ... then we further filter them according to search box text...
        .filter(experiment =>
          experiment &&
          Object
            .keys(experiment)
            .map(key =>
              displayedFields.includes(key) ? experiment[key] : null)
            .some(value =>
              value &&
              value
                .toString()
                .toLowerCase()
                .includes(selectedSearch.toLowerCase())))
        // ... and finally we filter according to selected dropdowns
        .filter(experiment =>
          selectedFilters.every(filter => filter ? this.containsValue(experiment, filter.value) : true))

    const currentPageData = entriesPerPage ?
      filteredExperiments.slice(entriesPerPage * (currentPage - 1), entriesPerPage * currentPage) : filteredExperiments

    return (
      <div className={`row expanded`}>
        <TableSearchHeader
          dropdownFilters={dropdownFilters}
          totalNumberOfRows={experiments.length}
          entriesPerPageOptions={this.entriesPerPageOptions}
          searchAllOnChange={this.searchAllOnChange}
          numberOfEntriesPerPageOnChange={this.numberOfEntriesPerPageOnChange}
          dropdownFiltersOnChange={this.filterOnChange}/>

        <TableContent
          {...{
            checkedRows,
            tableHeader,
            entriesPerPage,
            currentPage,
            searchedColumnIndex,
            searchQuery,
            orderedColumnIndex,
            ascendingOrder,
            host,
            enableDownload,
            currentPageData,
            downloadTooltip
          }}
          tableHeaderOnChange={this.tableHeaderOnChange}
          tableHeaderOnClick={this.tableHeaderOnClick}
          downloadOnChange={accession => this.handleCheckbox(accession)}/>


        <TableFooter
          {...{
            currentPage,
            entriesPerPage
          }}
          currentPageDataLength={currentPageData.length}
          dataArrayLength={filteredExperiments.length}
          dataLength={experiments.length}
          onChange={i => this.setState({currentPage: i})}/>
      </div>
    )
  }
}

ExperimentTable.propTypes = {
  host: PropTypes.string.isRequired,
  tableHeader: tableHeaderPropTypes,
  dropdownFilters: PropTypes.arrayOf(
    PropTypes.shape({
      dataParam: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired
    })).isRequired,
  selectedFilters: PropTypes.arrayOf(
    PropTypes.shape({
      dataParam: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired
    })
  ),
  enableDownload: PropTypes.bool,
  downloadTooltip: PropTypes.string,
  experiments: PropTypes.array.isRequired
}

ExperimentTable.defaultProps = {
  enableDownload: false,
  downloadTooltip: ``,
  selectedFilters: []
}

export default ExperimentTable
