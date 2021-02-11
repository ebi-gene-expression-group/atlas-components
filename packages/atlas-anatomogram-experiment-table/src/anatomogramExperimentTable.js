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
    this.handleResponse = this.handleResponse.bind(this)
    this.getExperimentsAndUpdateState = this.getExperimentsAndUpdateState.bind(this)
  }

  _handleSelectOnChange(event) {
    this.setState(() => ({
      selectedSpecies: event.target.value
    }))
  }

  _addRemoveFromSelectIds(ids) {

    let selectedIds = ids;
    var uri = "http://hlcadev2.westeurope.cloudapp.azure.com:8080/sc/json/experiments/hca/human";
    if (JSON.stringify(ids) === JSON.stringify(this.state.selectIds)) {
      // selecting the same item results in deselecting..
      console.log(`deselect`);
      selectedIds = [];
      //this._clearSelectedIds();
    }
    this.setState(() => ({
      selectIds: selectedIds
    }));

    console.log(`Organ:` + this.state.selectedSpecies + ` Ontology ID:` + selectedIds);
    if (selectedIds.length > 0) {
      this.getExperimentsAndUpdateState(uri + "?organismPart=" + selectedIds)
    }
    else {
      this.getExperimentsAndUpdateState(uri)
    }
  }

  getExperimentsAndUpdateState(uri) {
    $.getJSON(uri).done(function (json) {
      console.log("responseJson", json)
      this.handleResponse(json)
    }.bind(this));
  }

  handleResponse(json) {
    console.log("handleResponse", json)
    this.setState(() => ({
      experiments: json
    }));
    this.forceUpdate();
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
    console.log("RENDER!");
    const { anatomogramHost, dataHost, organs, resource } = this.props
    let experiments = this.state.experiments

    return (
      <div>
        <div>
          <h4>experiments</h4>
          <pre>Test={JSON.stringify(experiments)}</pre>
          <h4>this.state.selectIds</h4>
          <pre>selectIds={JSON.stringify(this.state.selectIds)}</pre>
          <h4>this.state.experiments</h4>
          <pre>exp={JSON.stringify(this.state.experiments)}</pre>
        </div>
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
            dataRows={this.state.experiments}

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
  host: `http://hlcadev2.westeurope.cloudapp.azure.com:8080/sc/`,
  resource: `json/experiments`,
  species: ``
}

export default AnatomogramExperimentTable
