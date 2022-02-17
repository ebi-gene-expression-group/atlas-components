import React from 'react'
import PropTypes from 'prop-types'

import Anatomogram from '@ebi-gene-expression-group/organ-anatomogram'
import { TableManager } from '@ebi-gene-expression-group/atlas-experiment-table'
import URI from 'urijs'

const capitalizeFirstLetter = (str) => str.charAt(0).toUpperCase() + str.slice(1)

const ontologyAccessionToOntologyUri = (accession) => {
  return accession.startsWith(`EFO`) ?
    `http://www.ebi.ac.uk/efo/${accession}` :
    `http://purl.obolibrary.org/obo/${accession}`
}


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
    this._afterSwitchView = this._afterSwitchView.bind(this)
    this.getExperimentsAndUpdateState = this.getExperimentsAndUpdateState.bind(this)
  }

  _handleSelectOnChange(event) {
    event.persist();
    this.setState(() => ({
      selectedSpecies: event.target.value
    }))
  }

  _addRemoveFromSelectIds(ids) {
    if (ids.length === 0 || ids[0].startsWith(`link`)) {
      this.setState({
        selectIds: ids
      })
    } else {
      this.setState({
        selectIds: ids,
        resource:
          URI(`json/experiments/${this.props.experimentAccession}/marker-genes/cell-types`, this.props.host)
            .search({ organismPart: ids.map(ontologyAccessionToOntologyUri).join(`,`) })
            .toString()
      })
    }
    this.getExperimentsAndUpdateState(this.props)
  }

  async getExperimentsAndUpdateState({ resource, host }) {
    this.setState({
      isLoading: true
    })

    const url = URI(resource, host).toString()
    try {
      const response = await fetch(url)

      if (!response.ok) {
        throw new Error(`${url} => ${response.status}`)
      }

      const jsonData = await response.json()
      this.setState({
        experiments: await jsonData,
        isLoading: false,
        hasError: null
      })
    } catch (e) {
      this.setState({
        experiments: props.experiments,
        isLoading: false,
        hasError: {
          description: `There was a problem communicating with the server. Please try again later.`,
          name: e.name,
          message: e.message
        }
      })
    }
  }

  _afterSwitchView(species, view) {
    let requestOntologyIds = []
    if (species === `kidney`) {
      if (view === `kidney`) {
        requestOntologyIds = [supportedOrgans[species]]
      } else if (view === `nephron`) {
        requestOntologyIds = [`UBERON_0001285`]
      } else if (view === `glomerulus`) {
        requestOntologyIds = [`UBERON_0000074`]
      } else if (view === `duct`) {
        requestOntologyIds = [`UBERON_0001232`]
      }
    } else if (species === `liver`) {
      if (view === `liver`) {
        requestOntologyIds = [supportedOrgans[species]]
      } else if (view === `lobule`) {
        requestOntologyIds = [ // `UBERON_0004647`,
          `CL_0000182`, `CL_0000632`, `UBERON_0001282`, `CL_1000488`, `UBERON_0001193`, `UBERON_0006841`,
          `UBERON_0001639`, `EFO_0010704`, `UBERON_0001281`, `CL_1000398`, `EFO_0010705`, `EFO_0010706`, `CL_0000091`
        ]
      }
    } else if (species === `lung`) {
      if (view === `lung`) {
        requestOntologyIds = [supportedOrgans[species]]
      } else if (view === `airway`) {
        requestOntologyIds = [ // `UBERON_0002184`,
          `CL_0002633`, `CL_1001567`, `CL_1000271`, `CL_0000158`, `EFO_0010666`, `CL_0002370`, `UBERON_0003504`,
          `CL_0002598`
        ]
      } else if (view === `alveoli_fin`) {
        requestOntologyIds = [`UBERON_0002299`, `UBERON_0002188`, `UBERON_0016405`]
      } else if (view === `alveoli_section`) {
        requestOntologyIds = [ // `UBERON_0003215`,
          `CL_0002062`, `CL_0002063`, `UBERON_0003456`, `EFO_0010667`, `EFO_0010668`, `EFO_0010669`
        ]
      }
    } else if (species === `pancreas`) {
      if (view === `pancreas`) {
        requestOntologyIds = [supportedOrgans[species]]
      } else if (view === `acinus`) {
        requestOntologyIds = [
          `CL_0000173`, `CL_0000171`, `CL_0000169`, `CL_0002275`, `CL_0005019`, `CL_0002410`, `CL_0000622`
        ]
      }
    } else if (species === `placenta`) {
      if (view === `placenta`) {
        requestOntologyIds = [supportedOrgans[species]]
      } else if (view === `cells`) {
        requestOntologyIds = [
          `CL_2000002`, `EFO_0010710`, `CL_3000001`, `UBERON_0000371`, `UBERON_0000319`, `UBERON_0000426`,
          `EFO_0010712`, `EFO_0010711`, `CL_0002601`, `EFO_0010708`
        ]
      }
    }

    this.setState({
      resource:
        URI(`json/experiments/${this.props.experimentAccession}/marker-genes/cell-types`, this.props.host)
          .search({ organismPart: requestOntologyIds.map(ontologyAccessionToOntologyUri).join(`,`) })
          .toString()
    })
  }

  handleResponse(json) {
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
    const { anatomogramHost, dataHost, organs, description } = this.props
    return (
      <div>
        <div className={`row`}>
          <div className={`large-3 small-12 medium-3 columns`}>
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
              afterSwitchView={this._afterSwitchView}
              organs={organs}
              atlasUrl={anatomogramHost}
            />
          </div>
          <div className={`large-9 small-12 medium-3 columns`}>
            <div>
              <p>{description}</p>
            </div>
          </div>

          <div>
            <TableManager
              host={dataHost}
              resource={this.state.resource}
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
        </div >
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
  organs: PropTypes.array.isRequired,
  description: PropTypes.string,
}

AnatomogramExperimentTable.defaultProps = {
  host: `https://www.ebi.ac.uk/gxa/sc/`,
  resource: `json/experiments`,
  species: `lung`,
  description: ``
}

export default AnatomogramExperimentTable