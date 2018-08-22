import React from 'react'
import PropTypes from 'prop-types'

import URI from 'urijs'

import ClusterTSnePlot from './ClusterTSnePlot'
import GeneExpressionTSnePlot from './GeneExpressionTSnePlot'

const fetchResponseJson = async (base, endpoint) => {
  const response = await fetch(URI(endpoint, base).toString())
  const responseJson = await response.json()
  return responseJson
}

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

  _fetchAndSetStateCellClusters({atlasUrl, experimentAccession, selectedColourBy, selectedColourByCategory, selectedPerplexity}) {
    this.setState({
      loadingCellClusters: true
    }, () => {
      let endpoint
      if(selectedColourByCategory === `clusters`) {
        endpoint = `json/experiments/${experimentAccession}/tsneplot/${selectedPerplexity}/clusters/k/${selectedColourBy}`
      }
      else if(selectedColourByCategory === `metadata`) {
        endpoint = `json/experiments/${experimentAccession}/tsneplot/${selectedPerplexity}/metadata/${selectedColourBy}`
      }
      fetchResponseJson(atlasUrl, endpoint)
        .then((responseJson) => {
          this.setState({
            cellClustersData: responseJson,
            cellClustersErrorMessage: null,
            loadingCellClusters: false
          })
        })
        .catch((reason) => {
          this.setState({
            cellClustersErrorMessage: `${reason.name}: ${reason.message}`,
            loadingCellClusters: false
          })
        })
    })
  }

  _fetchAndSetStateGeneId({atlasUrl, experimentAccession, selectedPerplexity, geneId}) {
    this.setState({
      loadingGeneExpression: true
    }, () => {
      fetchResponseJson(atlasUrl, `json/experiments/${experimentAccession}/tsneplot/${selectedPerplexity}/expression/${geneId}`)
        .then((responseJson) => {
          this.setState({
            geneExpressionData: responseJson,
            geneExpressionErrorMessage: null,
            loadingGeneExpression: false,
          })
        })
        .catch((reason) => {
          this.setState({
            geneExpressionErrorMessage: `${reason.name}: ${reason.message}`,
            loadingGeneExpression: false
          })
        })
    })
  }

  componentDidUpdate(previousProps) {
    if (previousProps.selectedPerplexity !== this.props.selectedPerplexity || previousProps.experimentAccession !== this.props.experimentAccession) {
      this._fetchAndSetStateCellClusters(this.props)
      this._fetchAndSetStateGeneId(this.props)
    } else if (previousProps.selectedColourByCategory !== this.props.selectedColourBy && previousProps.selectedColourBy !== this.props.selectedColourBy) {
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
    const {height, atlasUrl, resourcesUrl, suggesterEndpoint} = this.props
    const {wrapperClassName, clusterPlotClassName, expressionPlotClassName} = this.props
    const {geneId, speciesName, highlightClusters} = this.props
    const {ks, perplexities, selectedPerplexity, metadata, selectedColourBy} = this.props
    const {onChangePerplexity, onSelectGeneId, onChangeColourBy} = this.props
    const {loadingGeneExpression, geneExpressionData, geneExpressionErrorMessage} = this.state
    const {loadingCellClusters, cellClustersData, cellClustersErrorMessage} = this.state

    const getTooltipContent = (cellId) => {
      return fetchResponseJson(atlasUrl, `json/experiment/${this.props.experimentAccession}/cell/${cellId}/metadata`)
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
