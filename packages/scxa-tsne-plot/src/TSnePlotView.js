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

class ExperimentPageView extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      data: {
        max: null,
        min: null,
        series: [],
        unit: ``
      },
      errorMessage: null,
      loadingClusters: false,
      loadingGeneExpression: false
    }
  }

  _fetchAndSetState({atlasUrl, experimentAccession, k, perplexity, geneId}) {
    const atlasEndpoint = `json/experiments/${experimentAccession}/tsneplot/${perplexity}/clusters/${k}/expression/${geneId}`

    return fetchResponseJson(atlasUrl, atlasEndpoint)
      .then((responseJson) => {
        this.setState({
          data: responseJson,
          errorMessage: null,
          loadingClusters: false,
          loadingGeneExpression: false
        })
      })
      .catch((reason) => {
        this.setState({
          errorMessage: `${reason.name}: ${reason.message}`,
          loadingClusters: false,
          loadingGeneExpression: false
        })
      })
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.atlasUrl !== this.props.atlasUrl ||  // First two will never happen but it’s the right thing to do
        nextProps.experimentAccession !== this.props.experimentAccession ||
        nextProps.perplexity !== this.props.perplexity ||
        nextProps.k !== this.props.k) {

      this.setState({
        loadingClusters: true,
        loadingGeneExpression: true
      })
      this._fetchAndSetState(nextProps)

    } else if (nextProps.geneId !== this.props.geneId) {

      this.setState({
        loadingGeneExpression: true
      })
      this._fetchAndSetState(nextProps)

    }
  }

  componentDidMount() {
    this.setState({
      loadingClusters: true,
      loadingGeneExpression: true
    })
    // Having _fetchAndSetState as callback is the right thing, but then we can’t return the promise; see tests
    return this._fetchAndSetState(this.props)
  }

  render() {
    const {height, atlasUrl, resourcesUrl} = this.props
    const {suggesterEndpoint, geneId, highlightClusters, ks, k, perplexities, perplexity} = this.props
    const {onChangePerplexity, onChangeK, onSelectGeneId} = this.props
    const {loadingClusters, loadingGeneExpression, data, errorMessage} = this.state

    return (
      <div className={`row`}>
        <div className={`small-12 medium-6 columns`}>
          <ClusterTSnePlot height={height}
                           plotData={data}
                           perplexities={perplexities}
                           perplexity={perplexity}
                           onChangePerplexity={onChangePerplexity}
                           ks={ks}
                           k={k}
                           onChangeK={onChangeK}
                           highlightClusters={highlightClusters}
                           loading={loadingClusters}
                           resourcesUrl={resourcesUrl}
                           errorMessage={errorMessage}
          />
        </div>

        <div className={`small-12 medium-6 columns`}>
          <GeneExpressionTSnePlot height={height}
                                  plotData={data}
                                  atlasUrl={atlasUrl}
                                  suggesterEndpoint={suggesterEndpoint}
                                  onSelectGeneId={onSelectGeneId}
                                  geneId={geneId}
                                  highlightClusters={[]}
                                  loading={loadingGeneExpression}
                                  resourcesUrl={resourcesUrl}
                                  errorMessage={errorMessage}
          />
        </div>

      </div>
    )
  }

  componentDidCatch(error, info) {
    this.setState({
       errorMessage: `${error}`
     })
  }
}

ExperimentPageView.propTypes = {
  atlasUrl: PropTypes.string.isRequired,
  suggesterEndpoint: PropTypes.string.isRequired,
  experimentAccession: PropTypes.string.isRequired,
  ks: PropTypes.arrayOf(PropTypes.number).isRequired,
  k: PropTypes.number.isRequired,
  perplexities: PropTypes.arrayOf(PropTypes.number).isRequired,
  perplexity: PropTypes.number.isRequired,
  highlightClusters: PropTypes.arrayOf(PropTypes.number),
  geneId: PropTypes.string.isRequired,
  height: PropTypes.number,
  resourcesUrl: PropTypes.string,
  onSelectGeneId: PropTypes.func,
  onChangeK: PropTypes.func,
  onChangePerplexity: PropTypes.func
}

ExperimentPageView.defaultProps = {
  highlightClusters: [],
  geneId: ``,
  height: 600,
  onSelectGeneId: () => {},
  onKChange: () => {},
  onPerplexityChange: () => {}
}

export default ExperimentPageView
