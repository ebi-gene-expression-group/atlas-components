import React from 'react'
import PropTypes from 'prop-types'
import URI from 'urijs'

const _fetch = async (host, resource) => {
  const url = URI(resource, host).toString()
  const response = await fetch(url)
  // The promise returned by fetch may be fulfilled with a 4xx or 5xx return code...
  if (response.ok) {
    return await response.json()
  }
  throw new Error(
    `There was a problem communicating with the server. Please try again later. ` +
     `If the error persists, in order to help us debug the issue, please copy and paste this message and send it to ` +
     `atlas-feedback@ebi.ac.uk [${url} => ${response.status}]`
   )
}

const CalloutAlert = ({title, message}) =>
  <div className={`row column`}>
    <div className={`callout alert small`}>
      <h5>{title}</h5>
      <p>{message}</p>
    </div>
  </div>

CalloutAlert.propTypes = {
  title: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired
}

class GeneSearchResults extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      data: null,
      loading: true,
      error: null
    }
  }

  render() {
    const {data, loading, error} = this.state

    return(
      loading ?
        <div>Loading. Please wait...</div> :
        error ?
          <CalloutAlert title={error.name} message={error.message} />  :
          <div>Success!</div>
    )
  }

  _fetchAndSetState(host, resource) {
    this.setState({ loading: true })

    // then and catch methods are run asyncrhonously, “at the end of the current run of the JavaScript event loop”
    // according to section ‘Timing’ in https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises
    // so state.loading will be true when the Promise is handled
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
            error: error
          })
      )
  }

  componentDidMount() {
    return this._fetchAndSetState(this.props.host, this.props.resource)
  }

  componentDidCatch(error, info) {
    this.setState({
       error: error
     })
  }
}

GeneSearchResults.propTypes = {
  host: PropTypes.string.isRequired,
  resource: PropTypes.string.isRequired
}

export default GeneSearchResults
