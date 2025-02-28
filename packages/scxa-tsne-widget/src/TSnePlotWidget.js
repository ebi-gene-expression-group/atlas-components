import React from 'react'
import PropTypes from 'prop-types'

import URI from 'urijs'

import TSnePlotView from '@ebi-gene-expression-group/scxa-tsne-plot'

class TSnePlotWidget extends React.Component {
  constructor(props) {
    super(props)
    const defaultPlotMethodAndParameterisation = this.props.defaultPlotMethodAndParameterisation
    this.state = {
      selectedPlotType: Object.keys(defaultPlotMethodAndParameterisation)[0],
      selectedPlotOption: Object.values(Object.values(defaultPlotMethodAndParameterisation)[0])[0],
      selectedPlotOptionLabel: Object.keys(Object.values(defaultPlotMethodAndParameterisation)[0])[0] + ": "
          + Object.values(Object.values(defaultPlotMethodAndParameterisation)[0])[0],
      selectedColourBy: this.props.metadata ? this.props.metadata[0].value : ``,
      selectedGeneId: this.props.geneId,
      selectedColourByCategory: `metadata`,
      metadataErrorMessage: null,
      loadingMetadata: false,
      geneId: ``,
      highlightClusters: []
    }

    this.experimentAccessionInput = React.createRef()
    this.highlightClustersInput = React.createRef()

    this._handleSubmit = this._handleSubmit.bind(this)
  }
  _resetHighlightClusters() {
    this.setState({
      highlightClusters: []
    })
    if (this.highlightClustersInput.current) {
      this.highlightClustersInput.current.value = ``
    }
  }

  _handleSubmit(event) {
    const highlightClustersValue = this.highlightClustersInput.current ? this.highlightClustersInput.current.value : ''
    const highlightClusters = highlightClustersValue.split(',')
        .map((e) => parseInt(e.trim()))
        .filter((e) => !isNaN(e))

    this.setState({
      experimentAccession: this.experimentAccessionInput.current ? this.experimentAccessionInput.current.value : '',
      highlightClusters: highlightClusters
    })

    event.preventDefault()
  }

  render() {
    const {height, atlasUrl, suggesterEndpoint} = this.props
    const {wrapperClassName, clusterPlotClassName, expressionPlotClassName} = this.props
    const {geneIds, speciesName, ks, experimentAccession, showControls} = this.props
    const {plotTypesAndOptions, defaultPlotMethodAndParameterisation, metadata} = this.props
    const {selectedColourBy, selectedColourByCategory, loadingMetadata, selectedGeneId} = this.state

    const plotTypeDropdown =  [
      {
        plotType: Object.keys(defaultPlotMethodAndParameterisation)[0],
        plotOptions: plotTypesAndOptions[Object.keys(defaultPlotMethodAndParameterisation)[0]]
      },
      {
        plotType: Object.keys(defaultPlotMethodAndParameterisation)[1],
        plotOptions: plotTypesAndOptions[Object.keys(defaultPlotMethodAndParameterisation)[1]]
      }
    ]

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
            metadata={metadata}
            plotTypeDropdown={plotTypeDropdown}
            selectedColourBy={selectedColourBy}
            selectedColourByCategory={selectedColourByCategory}
            onChangePerplexity={() => {}}
            geneId={selectedGeneId}
            geneIds={geneIds}
            height={height}
            showControls={showControls}
            selectedPlotOption={this.state.selectedPlotOption}
            selectedPlotType={this.state.selectedPlotType}
            selectedPlotOptionLabel={this.state.selectedPlotOptionLabel}
            onChangePlotTypes={(plotOption) => {
              this.setState({
                selectedPlotType: plotOption.value,
                selectedPlotOption: Object.values(defaultPlotMethodAndParameterisation[plotOption.value])[0],
                selectedPlotOptionLabel: Object.keys(defaultPlotMethodAndParameterisation[plotOption.value])[0]
                    + ": " + Object.values(defaultPlotMethodAndParameterisation[plotOption.value])[0],
              })
            }}
            onChangePlotOptions={(plotOption) => {
              this.setState({
                selectedPlotOption: plotOption.value,
                selectedPlotOptionLabel: plotOption.label
              })
            }}
            highlightClusters={this.state.highlightClusters}
            onChangeColourBy={(colourByCategory, colourByValue) => {
              this.setState({
                selectedColourBy : colourByValue,
                selectedColourByCategory : colourByCategory
              })
              this._resetHighlightClusters()
            }}
            onSelectGeneId={(geneId) => {
              this.setState({ geneId: geneId })
              this._resetHighlightClusters()
            }}
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
  atlasUrl: `https://www.ebi.ac.uk/gxa/sc/`,
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
