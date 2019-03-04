import React from 'react'
import PropTypes from 'prop-types'
import URI from 'urijs'

import CalloutAlert from './CalloutAlert'
import FacetedSearchContainer from './FacetedSearchContainer'

class FetchLoader extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      data: null,
      loading: true,
      error: null
    }
  }

  static getDerivedStateFromProps(props, state) {
    const url = URI(props.resource, props.host).toString()
    // Store url in state so we can compare when props change.
    // Clear out previously-loaded data (so we don't render stale stuff).
    if (url !== state.url) {
      return {
        data: null,
        loading: true,
        error: null,
        url: url
      }
    }

    // No state update necessary
    return null
  }

  render() {
    const { ResultsHeaderClass, ResultElementClass, noResultsMessageFormatter, resultsMessageFormatter } = this.props
    const { data, loading, error } = this.state

    return(
      error ?
        <CalloutAlert error={error} /> :
        loading ?
          <div id={`loader`} className={`row expanded`}>
            <div className={`small-12 columns`}>
              <h5>Loading, please wait...</h5>
            </div>
          </div> :
          data.results && data.results.length > 0 ?
            <FacetedSearchContainer
              {...data}
              ResultsHeaderClass={ResultsHeaderClass}
              ResultElementClass={ResultElementClass}
              resultsMessage={resultsMessageFormatter(data)}/> :
            <div className={`row expanded`}>
              <div className={`small-12 columns`}>
                <h5>{noResultsMessageFormatter(data)}</h5>
              </div>
            </div>
    )
  }

  async componentDidUpdate(/*prevProps, prevState*/) {
    if (this.state.data === null && this.state.error === null) {
      await this._loadAsyncData(URI(this.props.resource, this.props.host).toString())
    }
  }

  async componentDidMount() {
    await this._loadAsyncData(URI(this.props.resource, this.props.host).toString())
  }

  async _loadAsyncData(url) {
    try {
      const response = await fetch(url)
      // The promise returned by fetch may be fulfilled with a 4xx or 5xx return code, so we need to explicitly check ok
      if (!response.ok) {
        throw new Error(`${url} => ${response.status}`)
      }

      this.setState({
        data: await response.json(),
        loading: false,
        error: null
      })
    } catch (e) {
      this.setState({
        data: null,
        loading: false,
        error: {
          description: `There was a problem communicating with the server. Please try again later.`,
          name: e.name,
          message: e.message
        }
      })
    }
  }

  componentDidCatch(error, info) {
    this.setState({
      error: {
        description: `There was a problem rendering this component.`,
        name: error.name,
        message: `${error.message} – ${info}`
      }
    })
  }
}

FetchLoader.propTypes = {
  host: PropTypes.string.isRequired,
  resource: PropTypes.string.isRequired,
  ResultsHeaderClass: PropTypes.func,
  ResultElementClass: PropTypes.func.isRequired,
  noResultsMessageFormatter: PropTypes.func,
  resultsMessageFormatter: PropTypes.func
}

FetchLoader.defaultProps = {
  noResultsMessageFormatter: () => ``,
  resultsMessageFormatter: () => ``
}

export default FetchLoader
