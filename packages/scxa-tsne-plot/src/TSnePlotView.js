import React from 'react'
import PropTypes from 'prop-types'

import URI from 'urijs'

import ClusterTSnePlot from './ClusterTSnePlot'
import GeneExpressionTSnePlot from './GeneExpressionTSnePlot'

class TSnePlotView extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      geneExpressionData: {
        max: null,
        min: null,
        series: [],
        unit: ``
      },
      cellClustersData: {
        series: []
      },
      geneExpressionErrorMessage: null,
      cellClustersErrorMessage: null,
      loadingCellClusters: false,
      loadingGeneExpression: false
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

  _fetchAndSetStateCellClusters(
    {atlasUrl, experimentAccession, selectedColourBy, selectedColourByCategory, selectedPerplexity}) {
    const resource =
      selectedColourByCategory === `clusters` ?
        `json/experiments/${experimentAccession}/tsneplot/${selectedPerplexity}/clusters/k/${selectedColourBy}` :
        selectedColourByCategory === `metadata` ?
          `json/experiments/${experimentAccession}/tsneplot/${selectedPerplexity}/metadata/${selectedColourBy}` :
          // We shouldn’t arrive here...
          undefined

    this._fetchAndSetState(
      resource, atlasUrl, `cellClustersData`, `cellClustersErrorMessage`, `loadingCellClusters`)
  }

  _fetchAndSetStateGeneId({atlasUrl, experimentAccession, selectedPerplexity, geneId}) {
    const resource = `json/experiments/${experimentAccession}/tsneplot/${selectedPerplexity}/expression/${geneId}`

    this._fetchAndSetState(
      resource, atlasUrl, `geneExpressionData`, `geneExpressionErrorMessage`, `loadingGeneExpression`)
  }

  componentDidUpdate(previousProps) {
    if (previousProps.selectedPerplexity !== this.props.selectedPerplexity ||
      previousProps.experimentAccession !== this.props.experimentAccession) {
      this._fetchAndSetStateCellClusters(this.props)
      this._fetchAndSetStateGeneId(this.props)
    } else if (previousProps.selectedColourByCategory !== this.props.selectedColourByCategory ||
      previousProps.selectedColourBy !== this.props.selectedColourBy) {
      this._fetchAndSetStateCellClusters(this.props)
    } else if (previousProps.geneId !== this.props.geneId) {
      this._fetchAndSetStateGeneId(this.props)
    }
  }

  componentDidMount() {
    this._fetchAndSetStateCellClusters(this.props)
    this._fetchAndSetStateGeneId(this.props)
  }

  render() {
    const {height, atlasUrl, resourcesUrl, suggesterEndpoint, showControls} = this.props
    const {wrapperClassName, clusterPlotClassName, expressionPlotClassName} = this.props
    const {geneId, speciesName} = this.props
    const highlightClusters = []
    const {ks, perplexities, selectedPerplexity, metadata, selectedColourBy, selectedColourByCategory} = this.props
    const {onChangePerplexity, onSelectGeneId, onChangeColourBy} = this.props
    const {loadingGeneExpression, geneExpressionData, geneExpressionErrorMessage} = this.state
    const {loadingCellClusters, cellClustersData, cellClustersErrorMessage} = this.state

    const getTooltipContent = async (cellId) => {
      const url = URI(`json/experiment/${this.props.experimentAccession}/cell/${cellId}/metadata`, atlasUrl).toString()
      try {
        const response = await fetch(url)

        if (!response.ok) {
          throw new Error(`${url} => ${response.status}`)
        }

        return await response.json()
      } catch (e) {
        throw new Error(`${e.name}: ${e.message}`)
      }
    }

    return (
      <div className={wrapperClassName}>
        <div className={clusterPlotClassName}>
          <ClusterTSnePlot
            height={height}
            plotData={cellClustersData}
            perplexities={perplexities}
            selectedPerplexity={selectedPerplexity}
            onChangePerplexity={onChangePerplexity}
            ks={ks}
            metadata={metadata}
            onChangeColourBy={onChangeColourBy}
            selectedColourBy={selectedColourBy}
            highlightClusters={highlightClusters}
            loading={loadingCellClusters}
            resourcesUrl={resourcesUrl}
            errorMessage={cellClustersErrorMessage}
            tooltipContent={getTooltipContent}
            clusterType={selectedColourByCategory}
            showControls={showControls}
          />
        </div>

        <div className={expressionPlotClassName}>
          <GeneExpressionTSnePlot
            height={height}
            plotData={geneExpressionData}
            atlasUrl={atlasUrl}
            suggesterEndpoint={suggesterEndpoint}
            onSelectGeneId={onSelectGeneId}
            geneId={geneId}
            speciesName={speciesName}
            highlightClusters={[]}
            loading={loadingGeneExpression}
            resourcesUrl={resourcesUrl}
            errorMessage={geneExpressionErrorMessage}
            showControls={showControls}
          />
        </div>
      </div>
    )
  }

  componentDidCatch(error) {
    this.setState({
      errorMessage: `${error}`
    })
  }
}

TSnePlotView.propTypes = {
  atlasUrl: PropTypes.string.isRequired,
  wrapperClassName: PropTypes.string,
  clusterPlotClassName: PropTypes.string,
  expressionPlotClassName: PropTypes.string,
  suggesterEndpoint: PropTypes.string.isRequired,
  experimentAccession: PropTypes.string.isRequired,
  ks: PropTypes.arrayOf(PropTypes.number).isRequired,
  perplexities: PropTypes.arrayOf(PropTypes.number).isRequired,
  selectedPerplexity: PropTypes.number.isRequired,
  showControls: PropTypes.bool,

  metadata: PropTypes.arrayOf(PropTypes.shape({
    value: PropTypes.string,
    label: PropTypes.string
  })),
  selectedColourBy: PropTypes.string,
  selectedColourByCategory: PropTypes.string,
  onChangeColourBy: PropTypes.func,

  highlightClusters: PropTypes.arrayOf(PropTypes.number),
  geneId: PropTypes.string.isRequired,
  speciesName: PropTypes.string.isRequired,
  height: PropTypes.number,
  resourcesUrl: PropTypes.string,
  onSelectGeneId: PropTypes.func,
  onChangePerplexity: PropTypes.func
}

TSnePlotView.defaultProps = {
  showControls: true,
  highlightClusters: [],
  wrapperClassName: `row`,
  clusterPlotClassName: `small-12 medium-6 columns`,
  expressionPlotClassName: `small-12 medium-6 columns`,
  geneId: ``,
  speciesName: ``,
  height: 800,
  onSelectGeneId: () => {},
  onChangeColourBy: () => {},
  onPerplexityChange: () => {}
}

export default TSnePlotView
