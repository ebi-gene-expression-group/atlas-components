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
      k: this.props.k || this.props.ks[0],
      perplexity: this.props.perplexity || this.props.perplexities[0],
      geneId: this.props.geneId,
      responseJson: {
        series: [],
        unit: ``
      },
      errorMessage: null,
      loadingClusters: false,
      loadingGeneExpression: false
    }

    this._handleChangeK = this._handleChange(`k`).bind(this)
    this._handleChangePerplexity = this._handleChange(`perplexity`).bind(this)
    this._handleSelect = this._handleSelect.bind(this)
    this._fetchAndSetState = this._fetchAndSetState.bind(this)
  }

  _handleChange(stateField) {
    return (event) => {
      this.setState({
        [stateField]: Number(event.target.value),
        loadingClusters: true,
        loadingGeneExpression: true
      }, this._fetchAndSetState)
    }
  }

  _handleSelect(event) {
    this.setState({
      geneId: event,
      loadingGeneExpression: true
    }, this._fetchAndSetState)
  }

  _fetchAndSetState() {
    const {experimentAccession, atlasUrl} = this.props
    const {k, geneId, perplexity} = this.state

    const atlasEndpoint = `json/experiments/${experimentAccession}/tsneplot/${perplexity}/clusters/${k}/expression/${geneId}`

    return fetchResponseJson(atlasUrl, atlasEndpoint)
      .then((responseJson) => {
        this.setState({
          responseJson: responseJson,
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

  componentDidMount() {
    this.setState({
      loadingClusters: true,
      loadingGeneExpression: true
    })
    // Having _fetchAndSetState as callback is the right thing, but then we can’t return the promise; see tests
    return this._fetchAndSetState()
  }

  render() {
    const {height, atlasUrl, suggesterEndpoint, ks, perplexities, highlightClusters, resourcesUrl} = this.props
    const {loadingClusters, loadingGeneExpression, responseJson, errorMessage, k, geneId, perplexity} = this.state

    return (
      <div className={`row`}>
        <div className={`small-12 medium-6 columns`}>
          <ClusterTSnePlot height={height}
                           plotData={responseJson}
                           ks={ks}
                           k={k}
                           onChangeK={this._handleChangeK}
                           perplexities={perplexities}
                           perplexity={perplexity}
                           onChangePerplexity={this._handleChangePerplexity}
                           highlightClusters={highlightClusters}
                           loading={loadingClusters}
                           resourcesUrl={resourcesUrl}
                           errorMessage={errorMessage}
          />
        </div>

        <div className={`small-12 medium-6 columns`}>
          <GeneExpressionTSnePlot height={height}
                                  plotData={responseJson}
                                  atlasUrl={atlasUrl}
                                  suggesterEndpoint={suggesterEndpoint}
                                  onSelect={this._handleSelect}
                                  geneId={geneId}
                                  highlightClusters={highlightClusters}
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
  k: PropTypes.number,
  perplexities: PropTypes.arrayOf(PropTypes.number).isRequired,
  perplexity: PropTypes.number,
  highlightClusters: PropTypes.array,
  geneId: PropTypes.string,
  height: PropTypes.number,
  resourcesUrl: PropTypes.string,
  onGeneIdSelect: PropTypes.func,
  onKChange: PropTypes.func
}

ExperimentPageView.defaultProps = {
  highlightClusters: [],
  geneId: ``,
  height: 600,
  onGeneIdSelect: () => {},
  onKChange: () => {}
}

export default ExperimentPageView
