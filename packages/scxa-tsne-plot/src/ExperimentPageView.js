import React from 'react'
import PropTypes from 'prop-types'

import {_colourizeClusters, _colourizeExpressionLevel} from './SeriesMapper'
import TSnePlot from 'expression-atlas-tsne-plot'
import AtlasAutocomplete from 'atlas-autocomplete'

class ExperimentPageView extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      geneId: this.props.geneId,
      k: this.props.k || this.props.availableClusters[0],
      highlightClusters: this.props.highlightClusters
    }

    this._handleChange = this._handleChange.bind(this)
  }

  _handleChange(stateField) {
    return (event) => {
      this.setState({
        [stateField]: event.target ? event.target.value : event
      })
    }
  }

  render() {
    const clusterOptions = this.props.availableClusters.sort()
      .map((name, ix) => (
        <option key={ix} value={name}>{name}</option>
      ))

    const clusterHighchartsConfig = {
      plotOptions: {
        series: {
          turboThreshold: 0,
          animation: false,
          marker: {
            radius: 4
          }
        },
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
        series: {
          turboThreshold: 0,
          animation: false,
          marker: {
            radius: 4
          }
        },
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
          <label>Number of clusters, <i>k</i></label>
          <select value={this.state.k} onChange={this._handleChange(`k`)}>
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
                             onSelect={this._handleChange(`geneId`)}/>
          <TSnePlot atlasUrl={this.props.atlasUrl}
                    sourceUrl={`json/experiments/${this.props.experimentAccession}/tsneplot/clusters/${this.state.k}/expression/${this.state.geneId}`}
                    seriesMapper={_colourizeExpressionLevel(this.props.expressionColourHue)}
                    resourcesUrl={this.props.resourcesUrl}
                    highchartsConfig={geneExpressionHighchartsConfig}/>
        </div>

      </div>
    )
  }
}

ExperimentPageView.propTypes = {
  atlasUrl: PropTypes.string.isRequired,
  resourcesUrl: PropTypes.string,
  suggesterEndpoint: PropTypes.string.isRequired,
  experimentAccession: PropTypes.string.isRequired,
  availableClusters: PropTypes.array.isRequired,
  k: PropTypes.number,
  highlightClusters: PropTypes.array,
  geneId: PropTypes.string,
  expressionColourHue: PropTypes.number,
  expressionColourLightness: PropTypes.number
}

ExperimentPageView.defaultProps = {
  highlightClusters: [],
  geneId: `blah`,
  expressionColourHue: 240,
  expressionColourLightness: 60
}

export default ExperimentPageView
