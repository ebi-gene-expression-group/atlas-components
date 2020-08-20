import React from 'react'
import PropTypes from 'prop-types'
import LoadingOverlay from './LoadingOverlay'
import CalloutAlert from './CalloutAlert'
import { cellTypeHeatmapView } from './cellTypeHeatmapView'
import URI from 'urijs'
import _ from "lodash";

class HeatmapView extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      data: [],
      filteredData: [],
      selectedClusterId: null,
      isLoading: true,
      hasError: null
    }
    this.onSelectCluster = this.onSelectCluster.bind(this)
  }

  async _fetchAndSetState({resource, host}) {
    this.setState({
      isLoading: true
    })

    const url = URI(resource, host).toString()
    console.log(`url`, url)
    try {
      const response = await fetch(url)
      console.log(`response`, response)

      if (!response.ok) {
        throw new Error(`${url} => ${response.status}`)
      }

      const jsonData = await response.json()
      this.setState({
        data: await jsonData,
        filteredData: await jsonData,
        selectedClusterId: null,
        isLoading: false,
        hasError: null
      })
    } catch(e) {
      console.log(`catch`)

      this.setState({
        data: null,
        isLoading: false,
        hasError: {
          description: `There was a problem communicating with the server. Please try again later.`,
          name: e.name,
          message: e.message
        }
      })
    }
  }

  componentDidMount() {
    this._fetchAndSetState(this.props)
  }

  componentDidUpdate(previousProps) {
    if (previousProps.resource !== this.props.resource) {
      this._fetchAndSetState(this.props)
    }
  }

  componentDidCatch(error, info) {
    this.setState({
      hasError: {
        description: `There was a problem rendering this component.`,
        name: error.name,
        message: `${error.message} – ${info}`
      }
    })
  }

 onSelectCluster(selectedOption) {
   this.setState((state) => ({
     data: _.cloneDeep(state.data),
     filteredData: selectedOption.value === `all` ?
       _.cloneDeep(state.data) :
       _.filter(state.data, {'clusterIdWhereMarker': parseInt(selectedOption.value)}),
     selectedClusterId: selectedOption
   }))
 }

render() {
    const { isLoading, hasError } = this.state
    const { wrapperClassName, plotWrapperClassName } = this.props
    const view = cellTypeHeatmapView(this.props.props, this.state)

    return (
      hasError ?
        <CalloutAlert error={hasError}/> :
        <div>
          { this.props.type == `cluster` ? view[1] : `` }
          <div className={wrapperClassName}>
            <div className={plotWrapperClassName} style={{position: `relative`}}>
              {view[0]}
              <LoadingOverlay
                show={isLoading}
              />
            </div>
          </div>
        </div>
    )
  }
}

HeatmapView.propTypes = {
  host: PropTypes.string.isRequired,
  resource: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  props: PropTypes.object.isRequired
}

export default HeatmapView
