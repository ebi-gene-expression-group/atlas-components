import React from 'react'
import PropTypes from 'prop-types'
import URI from 'urijs'

import FilterList from './FilterList'

const _fetch = async (host, resource) => {
  const url = URI(resource, host).toString()
  const response = await fetch(url)
  // The promise returned by fetch may be fulfilled with a 4xx or 5xx return code...
  if (response.ok) {
    return await response.json()
  }
  throw new Error(`${url} => ${response.status}`)
}

const CalloutAlert = ({error}) =>
  <div className={`row column`}>
    <div className={`callout alert small`}>
      <h5>Oops!</h5>
      <p>
        {error.description}<br/>
        If the error persists, in order to help us debug the issue, please copy and paste the URL and this message and
        send it to <a href={`mailto:atlas-feedback@ebi.ac.uk`}>atlas-feedback@ebi.ac.uk</a>:
      </p>
      <code>{`${error.name}: ${error.message}`}</code>
    </div>
  </div>

CalloutAlert.propTypes = {
  error: PropTypes.shape({
    description: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    message: PropTypes.string.isRequired
  })
}

class FetchLoader extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      data: null,
      loading: true,
      error: null
    }
  }

  render() {
    const {ResultElementComponent} = this.props
    const {data, loading, error} = this.state

    return(
      error ?
        <CalloutAlert error={error} /> :
      loading ?
        <div id={`loader`}>Loading, please wait...</div> :
        <FilterList {...data} ResultElementComponent={ResultElementComponent}/>
    )
  }

  _fetchAndSetState(host, resource) {
    this.setState({ loading: true })

    // then and catch methods are run “at the end of the current run of the JavaScript event loop” according to section
    // ‘Timing’ in https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises, so state.loading will
    // be true when the promise is handled. Strictly speaking, the right thing to do would be to call _fetch in a
    // callback passed as the second argument to setState, but if we wanted to also return the promise to test the
    // component we’d need to declare a variable outside, set it within the callback, and return it... not pretty!

    return _fetch(host, resource).then(
      (responseJson) =>
        this.setState({
          data: responseJson,
          loading: false,
          error: null
        })
      )
      .catch(
        (error) =>
          this.setState({
            data: null,
            loading: false,
            error: {
              description: `There was a problem communicating with the server. Please try again later.`,
              name: error.name,
              message: error.message
            }
          })
      )
  }

  componentDidMount() {
    return this._fetchAndSetState(this.props.host, this.props.resource)
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
  ResultElementComponent: PropTypes.func.isRequired
}

export default FetchLoader