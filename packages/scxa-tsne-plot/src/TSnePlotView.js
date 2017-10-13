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
      k: this.props.k || this.props.availableClusters[0],
      perplexity: this.props.perplexity || this.props.perplexityArray[0],
      geneId: this.props.geneId,
      responseJson: {
        series: [],
        unit: ``
      },
      errorMessage: null,
      loadingClusters: false,
      loadingGeneExpression: false
    }

    this._handleChange = this._handleChange.bind(this)
    this._handleSelect = this._handleSelect.bind(this)
    this._fetchAndSetState = this._fetchAndSetState.bind(this)
    this._onChangePerplexity = this._onChangePerplexity.bind(this)
  }

  _handleChange(event) {
    this.setState({
      k: event.target.value,
      loadingClusters: true,
      loadingGeneExpression: true
    }, this._fetchAndSetState)
    this.props.onKChange(event.target.value)
  }

  _handleSelect(event) {
    this.setState({
      geneId: event,
      loadingGeneExpression: true
    }, this._fetchAndSetState)
    this.props.onGeneIdSelect(event)
  }

  _onChangePerplexity(event) {
    this.setState({
      perplexity: event.target.value,
      loadingClusters: true,
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
    const {height, atlasUrl, suggesterEndpoint, availableClusters, highlightClusters, resourcesUrl, perplexityArray} = this.props
    const {loadingClusters, loadingGeneExpression, responseJson, errorMessage, k, geneId, perplexity} = this.state

    const perplexityOptions = perplexityArray.sort().map((name, ix) => (
        <option key={ix} value={name}>{name}</option>
    ))


    return (
      <div className={`row`}>
        <div className={`column`}>
          <div key={`perplexity-select`} className={`medium-2`}>
            <label>Perplexity, <i>perplexity</i></label>
            <select value={perplexity} onChange={this._onChangePerplexity}>
                {perplexityOptions}
            </select>
          </div>
        </div>


        <div className={`small-12 medium-6 columns`}>
          <ClusterTSnePlot height={height}
                           plotData={responseJson}
                           availableClusters={availableClusters}
                           k={k}
                           onChange={this._handleChange}
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
  availableClusters: PropTypes.array.isRequired,
  k: PropTypes.number,
  perplexity: PropTypes.number,
  perplexityArray: PropTypes.array,
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
