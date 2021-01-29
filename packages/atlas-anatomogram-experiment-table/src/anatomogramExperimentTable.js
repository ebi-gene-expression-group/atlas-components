import React from 'react'
import PropTypes from 'prop-types'

import Anatomogram from '@ebi-gene-expression-group/organ-anatomogram'
import { TableManager } from '@ebi-gene-expression-group/atlas-experiment-table'

const capitalizeFirstLetter = (str) => str.charAt(0).toUpperCase() + str.slice(1)

class AnatomogramExperimentTable extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      selectedSpecies: props.species,
      showIds: props.showIds,
      experiments: props.experiments,
      highlightIds: [],
      selectIds: [],
      selectAllIds: [],
      selectedOrganId: ``
    }


    this._addRemoveFromSelectIds = this._addRemoveFromSelectIds.bind(this)
    this._showLinkBoxIds = this._showLinkBoxIds.bind(this)
    this._clearSelectedIds = this._clearSelectedIds.bind(this)
    this._handleSelectOnChange = this._handleSelectOnChange.bind(this)
  }

  _handleSelectOnChange(event) {
    this.setState({
      selectedSpecies: event.target.value
    })
  }

  _addRemoveFromSelectIds(ids) {
    this.setState({
      selectIds: ids
    })
    console.log(`Organ:` + this.state.selectedSpecies + ` Ontology ID:` + ids);
    //  window.alert(`Organ:` + this.state.selectedSpecies + ` Ontology ID:` + ids)
    // TEST TO PRINT SOLR QUERY RESULTS
    //    var that = this;
    var uri = "http://hlcadev2.westeurope.cloudapp.azure.com:8080/sc/json/experiments/hca/human?organismPart=" + ids;
    this.getExperimentsAndUpdateState(uri)
    // $.getJSON("http://hlcadev2.westeurope.cloudapp.azure.com:8080/sc/json/experiments/hca/human?organismPart=" + ids).done(
    //   function (json) {
    //     console.log("that", json)
    //     that.setState({ experiments: json })
    //     this.handleResponse(json, this)
    //   }
    // )
    console.log("this", this.state.experiments)
  }

  getExperimentsAndUpdateState(uri) {
    $.getJSON(uri).done(function (json) {
      console.log("responseJson", json)
      this.handleResponse(json)
    }.bind(this));
  }

  handleResponse(json) {
    console.log("updateState", json)
    this.setState({ experiments: json })
    this.forceUpdate();
    console.log("this", this.state.experiments)
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
    const { anatomogramHost, dataHost, organs, resource } = this.props
    const { experiments } = this.state

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
              atlasUrl={anatomogramHost}
            />
          </div>
        </div>

        <div>
          <TableManager
            host={dataHost}
            resource={resource}
            dataRows={experiments}
            tableHeaders={[
              {
                label: `Load date`,
                dataKey: `loadDate`,
                sortable: true,
                width: 0.5
              },
              {
                label: `Species`,
                dataKey: `species`,
                searchable: true,
                sortable: true
              },
              {
                label: `Title`,
                dataKey: `experimentDescription`,
                searchable: true,
                sortable: true,
                linkTo: function (dataRow) {
                  return `experiments/` + dataRow.experimentAccession + `/results`
                },
                width: 2
              },
              {
                label: `Experimental factors`,
                dataKey: `experimentalFactors`,
                searchable: true
              },
              {
                label: `Number of cells`,
                dataKey: `numberOfAssays`,
                sortable: true,
                linkTo: function (dataRow) {
                  return `experiments/` + dataRow.experimentAccession + `/experiment-design`
                },
                width: 0.5
              }
            ]}
            dropdownFilters={[
              {
                label: `Kingdom`,
                dataKey: `kingdom`
              },
              {
                label: `Experiment Project`,
                dataKey: `experimentProjects`
              },
              {
                label: `Technology Type`,
                dataKey: `technologyType`
              }
            ]}
            rowSelectionColumn={{
              label: `Download`,
              dataKey: `experimentAccession`,
              tooltipContent:
                `<ul>` +
                `<li>Raw filtered count matrix after quantification</li>` +
                `<li>Normalised filtered count matrix after quantification</li>` +
                `<li>Experiment design file with experimental metadata</li>` +
                `</ul>`,
              width: 0.5
            }}
            sortColumnIndex={0}
            ascendingOrder={false}
            renameDataKeys={{ experiments: `dataRows` }}
          />
        </div>
      </div>
    )
  }
}

AnatomogramExperimentTable.propTypes = {
  host: PropTypes.string,
  resource: PropTypes.string,
  experiments: PropTypes.array,
  showIds: PropTypes.array.isRequired,
  species: PropTypes.string,
  organs: PropTypes.array.isRequired
}

AnatomogramExperimentTable.defaultProps = {
  host: `http://http://hlcadev2.westeurope.cloudapp.azure.com:8080/sc/`,
  resource: `json/experiments`,
  species: ``
}

export default AnatomogramExperimentTable
