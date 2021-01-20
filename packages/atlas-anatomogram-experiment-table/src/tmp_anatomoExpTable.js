import React from 'react'
import PropTypes from 'prop-types'

import Anatomogram from '@ebi-gene-expression-group/organ-anatomogram'
import HeatmapView from '@ebi-gene-expression-group/scxa-experiment-cell-type-heatmap'
import ExperimentTable from '@ebi-gene-expression-group/atlas-experiment-table'

const capitalizeFirstLetter = (str) => str.charAt(0).toUpperCase() + str.slice(1)

class AnatomogramExperimentTable extends React.Component {
    constructor(props) {
        super(props)
        this.entriesPerPageOptions = [10, 25, 50]
        this.state = {
            selectedSpecies: props.species,
            showIds: props.showIds,
            highlightIds: [],
            selectIds: [],
            selectAllIds: [],
            resource: props.resource[0],
            // entries from ExperimentTable.js
            searchQuery: props.species.trim(),
            orderedColumnIndex: 0,
            searchedColumnIndex: props.species.trim() ?
                props.tableHeader.findIndex(header => header.dataParam === `species`) : 1,
            ascendingOrder: false,
            checkedRows: [],
            // currentPage: 1,
            // entriesPerPage: this.entriesPerPageOptions[0],
            // selectedSearch: ``,
            // selectedDropdownFilters: [],
            // experimentTableFilters: props.tableFilters.map(filter => {
            //  return {
            //    label: filter.label,
            //    options: _.chain(props.experiments).flatMap(filter.dataParam).uniq().value()
            //  }
            // })
        }

        this._addRemoveFromSelectIds = this._addRemoveFromSelectIds.bind(this)
        this._showLinkBoxIds = this._showLinkBoxIds.bind(this)
        this._clearSelectedIds = this._clearSelectedIds.bind(this)
        this._handleSelectOnChange = this._handleSelectOnChange.bind(this)

        // entries from ExperimentTable.js
        this.sort = this.sort.bind(this)
        this.filter = this.filter.bind(this)
        this.containsValue = this.containsValue.bind(this)
        this.dropdownFilterOnChange = this.dropdownFilterOnChange.bind(this)
        this.searchAllOnChange = this.searchAllOnChange.bind(this)
        this.numberOfEntriesPerPageOnChange = this.numberOfEntriesPerPageOnChange.bind(this)

        this.handleCheckbox = this.handleCheckbox.bind(this)
        this.tableHeaderOnChange = this.tableHeaderOnChange.bind(this)
        this.tableHeaderOnClick = this.tableHeaderOnClick.bind(this)
    }

    // start functions from ExperimentTable.js
    sort(data) {
        const reverseDateRepresentation = date => {
            let parts = date.split(`-`)
            return `${parts[2]}-${parts[1]}-${parts[0]}`
        }
        const { ascendingOrder, orderedColumnIndex } = this.state
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
    /* this function searches deeply if value exists in json object e.g.
    jsonObject = {a: 1, b: 2} then containsValue(jsonObject, 1) will return true
    jsonObject = {a: 1, b: 2} then containsValue(jsonObject, 3) will return false
    jsonObject = {a: [
                   b: {
                    c: "foo",
                    d: [
                      da: 1,
                      db: 2,
                      dc: 3
                       ]
                    e: "bar"
                      }
                     ]
                  }
     then constainsValue(jsonObject, 2) will return true */
    containsValue(jsonObject, value) {
        return Object.keys(jsonObject).some(key =>
            typeof jsonObject[key] === `object` ?
                this.containsValue(jsonObject[key], value) : jsonObject[key] === value
        )
    }

    handleCheckbox(accession) {
        const checkedArray = this.state.checkedRows.includes(accession) ?
            this.state.checkedRows.filter(e => e !== accession) :
            this.state.checkedRows.concat(accession)

        this.setState({ checkedRows: checkedArray })
    }

    dropdownFilterOnChange(e, label) {
        const selectedDropdown = {
            label: label,
            value: e.target.value
        }
        const { selectedDropdownFilters } = this.state
        const index = selectedDropdownFilters.findIndex(dropdown => dropdown.label === label)
        if (index !== -1) {
            selectedDropdown.value !== `` ?
                selectedDropdownFilters[index].value = e.target.value : selectedDropdownFilters.splice(index, 1)
            this.setState({
                selectedDropdownFilters: selectedDropdownFilters,
                currentPage: 1,
                searchQuery: ``
            })
        } else {
            selectedDropdownFilters.push(selectedDropdown)
            this.setState({
                selectedDropdownFilters: selectedDropdownFilters,
                currentPage: 1,
                searchQuery: ``
            })
        }
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
    // end functions from ExperimentTable.js

    _handleSelectOnChange(event) {
        this.setState({
            selectedSpecies: event.target.value
        })
    }

    _addRemoveFromSelectIds(ids) {
        this.setState({
            selectIds: ids
        })

        window.alert(`Organ:` + this.state.selectedSpecies + ` Ontology ID:` + ids + ` Experiment Accession:` + this.props.experimentAccession)
    }

    _showLinkBoxIds(id) {
        this.setState({
            showIds: [...new Set(id.concat(this.state.showIds))]
        })
    }

    _clearSelectedIds() {
        this.setState({
            showIds: this.props.showIds,
            selectIds: [],
            highlightIds: []
        })
    }

    render() {
        const { host, organs } = this.props

        const heatmapArgs = {
            resource: ``,
            host: ``,
            type: `cellType`,
            props: {
                species: `Homo sapiens`,
                hasDynamicHeight: true,
                heatmapRowHeight: 20,
                wrapperClassName: `row expanded`,
            }
        }

        return (
            <div>
                <div className={`row`}>
                    <div className={`small-12 medium-3 columns`}>
                        {
                            organs.length > 1 &&
                            <div className={`small-6 small-centered columns`}>
                                <select value={this.state.selectedSpecies} onChange={this._handleSelectOnChange}>
                                    {organs.map((organ) => {
                                        return <option key={organ} value={organ}>{capitalizeFirstLetter(organ.replace(`_`, ` `))}</option>
                                    })}
                                </select>
                            </div>
                        }

                        <Anatomogram
                            species={this.state.selectedSpecies}
                            showIds={this.state.showIds}
                            highlightIds={this.state.highlightIds}
                            selectIds={this.state.selectIds}
                            selectAllIds={this.state.selectAllIds}
                            clearSelectedIds={this._clearSelectedIds}
                            onClick={this._addRemoveFromSelectIds}
                            showLinkBoxIds={this._showLinkBoxIds}
                            organs={organs}
                            atlasUrl={host}
                        />
                    </div>

                    <div className={`small-12 medium-9 columns`}>
                        <HeatmapView {...heatmapArgs} resource={this.state.resource} />
                    </div>
                </div>
                <div className={`row`}>
                    <h3>Experiment Table</h3>
                </div>
            </div>
        )
    }
}

AnatomogramExperimentTable.propTypes = {
    host: PropTypes.string,
    resource: PropTypes.string,
    experimentAccession: PropTypes.string.isRequired,
    showIds: PropTypes.array.isRequired,
    species: PropTypes.string.isRequired,
    organs: PropTypes.array.isRequired,
    experiments: PropTypes.array.isRequired,
    host: PropTypes.string.isRequired,
    species: PropTypes.string,
    resource: PropTypes.string.isRequired,
    tableHeader: PropTypes.arrayOf(
        PropTypes.shape({
            type: PropTypes.string.isRequired,
            title: PropTypes.string.isRequired,
            width: PropTypes.number.isRequired,
            dataParam: PropTypes.string.isRequired
        })
    ),
    enableDownload: PropTypes.bool.isRequired,
    downloadTooltip: PropTypes.string.isRequired,
    tableFilters: PropTypes.arrayOf(
        PropTypes.shape({
            label: PropTypes.string.isRequired,
            dataParam: PropTypes.string.isRequired
        })
    ).isRequired
}

AnatomogramExperimentTable.defaultProps = {
    host: `http://localhost:9000`,
    resource: `/json/anatomogram_experiments`,
    species: ``
}

export default AnatomogramExperimentTable
