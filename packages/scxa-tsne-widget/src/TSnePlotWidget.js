import React from 'react'
import PropTypes from 'prop-types'
import {find as _find} from "lodash"

import URI from 'urijs'

import TSnePlotView from '@ebi-gene-expression-group/scxa-tsne-plot'

class TSnePlotWidget extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      plotdata: {
        metadata: [],
        plotTypesAndOptions: [], 
        defaultPlotMethodAndParameterisation: []
      },
      selectedColourBy: ``,
      selectedColourByCategory: `metadata`,
      metadataErrorMessage: null,
      loadingMetadata: false,
      selectedPlotType: ``,
      geneId: this.props.geneId,
      selectedPlotOption: ``,
      selectedPlotOptionLabel: ``
    }
  }

  async _fetchAndSetState(resource, baseUrl, dataField, errorMessageField, loadingField) {
    this.setState({
      [loadingField]: true
    })

    const url = URI(resource, baseUrl).toString()

    try {
      const response = await fetch(url)

      if (!response.ok) {
        throw new Error(`${url} => ${response.status}`)
      }

      this.setState({
        [dataField]: await response.json(),
        [errorMessageField]: null,
        [loadingField]: false,
      })
    } catch (e) {
      this.setState({
        [errorMessageField]: `${e.name}: ${e.message}`,
        [loadingField]: false
      })
    }
  }

  _fetchAndSetStateMetadata(
    {atlasUrl, experimentAccession}) {
    const resource = `json/experiments/${experimentAccession}/metadata/tsneplot`

    this._fetchAndSetState(
      resource, atlasUrl, `plotdata`, `metadataErrorMessage`, `loadingMetadata`) // this will work once backend code is merged in sc atlas. In meantime, it will not fetch metadata option as there is no endpoint currently in sc atlas
  }

  _onChangeColourBy(colourByCategory, colourByValue) {
    this.setState({
      selectedColourBy: colourByValue,
      selectedColourByCategory: colourByCategory
    })
  }

  componentWillMount() {
    this._fetchAndSetStateMetadata(this.props)
  }

  render() {
    const {height, atlasUrl, suggesterEndpoint} = this.props
    const {wrapperClassName, clusterPlotClassName, expressionPlotClassName} = this.props
    const {geneIds, speciesName, ks, experimentAccession, showControls} = this.props
    const {loadingMetadata, geneId, selectedColourBy, selectedPlotOption, selectedPlotType, selectedPlotOptionLabel, onChangePlotTypes} = this.state
    const {plotTypesAndOptions, defaultPlotMethodAndParameterisation, metadata} = this.state.plotdata

    const plotTypeDropdown =  [
      {
        plotType: `UMAP`,
        plotOptions: plotTypesAndOptions.umap
      },
      {
        plotType: `tSNE`,
        plotOptions: plotTypesAndOptions.tsne
      }
    ]
    // ks -> for future use
    // selectedColourBy -> used default k value as we are not showing widget controls for now
    // selectedColourByCategory -> Is the plot coloured by clusters or metadata (as we not showing controls so used 'clusters' as default selected category
    // selectedPerplexity -> //default value given for now
    // showControls ->  flag to control weather controls over t-SNE plots are shown or not

    return (
      loadingMetadata ?
        <p className={`row column loading-message`}>Loading, please wait…</p> :
        <React.Fragment>
          <TSnePlotView
            atlasUrl={atlasUrl}
            suggesterEndpoint={suggesterEndpoint}
            wrapperClassName={wrapperClassName}
            clusterPlotClassName={clusterPlotClassName}
            expressionPlotClassName={expressionPlotClassName}
            speciesName={speciesName}
            experimentAccession={experimentAccession}
            ks={ks}
            plotTypeDropdown={plotTypeDropdown}
            //by default it is a tsne plot
            selectedPlotOption={selectedPlotOption == `` ? defaultPlotMethodAndParameterisation.tsne : selectedPlotOption}
            selectedPlotType={selectedPlotType== `` ? `tsne` : selectedPlotType}
            selectedPlotOptionLabel={selectedPlotOptionLabel == `` ?
                Object.keys(defaultPlotMethodAndParameterisation.tsne)[0] + `: ` +
                Object.values(defaultPlotMethodAndParameterisation.tsne)[0] :
                selectedPlotOptionLabel}
            metadata={metadata}
            selectedColourBy={metadata.map(meta => meta.label).indexOf(`inferred cell type - authors labels`) == -1 ?
                metadata[0].label : `inferred cell type - authors labels`}
            onChangePlotTypes={
              (plotOption) => {
                this.setState({
                  selectedPlotType: plotOption,
                  selectedPlotOption: defaultPlotMethodAndParameterisation[plotOption],
                  selectedPlotOptionLabel: Object.keys(defaultPlotMethodAndParameterisation[plotOption])[0] + `: ` +
                      Object.values(defaultPlotMethodAndParameterisation[plotOption])[0]
                })}
            }
            onChangePlotOptions={
              (plotOption) => {
                this.setState({
                  selectedPlotOption: plotOption.value,
                  selectedPlotOptionLabel: plotOption.label
                })}
            }
            geneId={geneId}
            geneIds={geneIds}
            height={height}
            onChangeColourBy={(colourByCategory, colourByValue) =>
              this._onChangeColourBy(colourByCategory, colourByValue)
            }
            onSelectGeneId={(geneId) => this.setState({ geneId: geneId.value })}
            showControls={showControls}
          />
          <p>
            To know more about this experiment please go to <a target={`_blank`} href={`https://www.ebi.ac.uk/gxa/sc/experiments/${experimentAccession}`}>Single Cell Expression Atlas </a>.
          </p>
        </React.Fragment>
    )
  }
}

TSnePlotWidget.propTypes = {
  atlasUrl: PropTypes.string,
  wrapperClassName: PropTypes.string,
  clusterPlotClassName: PropTypes.string,
  expressionPlotClassName: PropTypes.string,
  experimentAccession: PropTypes.string.isRequired,
  geneId: PropTypes.string.isRequired,
  geneIds: PropTypes.arrayOf(PropTypes.string),
  ks: PropTypes.arrayOf(PropTypes.number),
  suggesterEndpoint: PropTypes.string,
  speciesName: PropTypes.string,
  height: PropTypes.number,
  showControls: PropTypes.bool
}


TSnePlotWidget.defaultProps = {
  atlasUrl: `http://localhost:8080/gxa/sc/`,
  suggesterEndpoint: `json/suggestions`,
  wrapperClassName: `row expanded`,
  clusterPlotClassName: `small-12 large-6 columns`,
  expressionPlotClassName: `small-12 large-6 columns`,
  speciesName: ``,
  height: 800,
  ks: [],
  geneIds: [],
  showControls: false
}

export default TSnePlotWidget
