import React from 'react'
import PropTypes from 'prop-types'

import URI from 'urijs'
import queryString from 'query-string'

import {_colourizeClusters, _colourizeExpressionLevel} from './SeriesMapper'
import TSnePlot from 'expression-atlas-tsne-plot'
import AtlasAutocomplete from 'atlas-autocomplete'

class ExperimentPageView extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      params: queryString.parse(props.location.search),
      geneId: ``,
      k: 0,
      clusterId: [],
    }
  }

  handleChange(param, item) {
    let _newparam = {}
    _newparam[param] = (param === `k` ? Number.parseInt(item.target.value) : item)
    this.setState(_newparam)

    this.props.history.push(
      `?` +
      queryString.stringify({
        geneId: (param === `geneId` ? item : this.state.geneId),
        k: (param === `k` ? item.target.value : this.state.k)})
      + `&clusterId=[${this.state.clusterId}]`
    )
  }

  componentDidMount() {
    this.setState({
      geneId: this.state.params.geneId,
      k: this.state.params.k !== undefined ? Number.parseInt(this.state.params.k) : this.state.k,
      clusterId: JSON.parse(this.state.params.clusterId || `[]`)
    })
  }

  render() {
    const clusterOptions = this.props.availableClusters.sort()
      .map((name, ix) => (
        <option key={ix} value={name}>{name}</option>
      ))

    const selectedCluster = this.state.k ? this.state.k : this.props.availableClusters[0]

    const clusterHighchartsConfig = {
      plotOptions: {
        scatter: {
          tooltip: {
            headerFormat: `<b>Cluster {series.name}</b><br>`,
            pointFormat: `{point.name}`
          }
        }
      }
    }

    const geneExpressionHighchartsConfig = {
      plotOptions: {
        scatter: {
          tooltip: {
            headerFormat: `<b>{point.key} – Cluster {series.name}</b><br>`,
            pointFormat: `Expression level: {point.expressionLevel}`
          }
        }
      }
    }

    return (
      <div className={`row`}>

        <div className={`small-6 columns`}>
          <label>Clustering: {this.state.k}</label>
          <select value={selectedCluster} onChange={this.handleChange.bind(this, `k`)}>
            {clusterOptions}
          </select>
          <TSnePlot atlasUrl={this.props.atlasUrl}
                    sourceUrl={`json/experiments/${this.props.experimentAccession}/tsneplot/clusters/${this.state.k}`}
                    seriesMapper={_colourizeClusters(this.props.highlightClusters)}
                    resourcesUrl={this.props.resourcesUrl}
                    highchartsConfig={clusterHighchartsConfig}/>
        </div>

        <div className={`small-6 columns`}>
          <AtlasAutocomplete atlasUrl={this.props.atlasUrl}
                             suggesterEndpoint={this.props.suggesterEndpoint}
                             enableSpeciesFilter={false}
                             initialValue={this.state.geneId}
                             onSelect={this.handleChange.bind(this, `geneId`)}/>
          <TSnePlot atlasUrl={this.props.atlasUrl}
                    sourceUrl={`json/experiments/${this.props.experimentAccession}/tsneplot/expression/${this.state.geneId}`}
                    seriesMapper={_colourizeExpressionLevel(this.props.expressionColourHue)}
                    resourcesUrl={this.props.resourcesUrl}
                    highchartsConfig={geneExpressionHighchartsConfig}/>
        </div>

      </div>
    )
  }
}

ExperimentPageView.propTypes = {
  props: PropTypes.object,
  atlasUrl: PropTypes.string,
  resourcesUrl: PropTypes.string,
  suggesterEndpoint: PropTypes.string,
  availableClusters: PropTypes.array.isRequired,
  highlightClusters: PropTypes.array,
  expressionColourHue: PropTypes.number
}

export default ExperimentPageView
