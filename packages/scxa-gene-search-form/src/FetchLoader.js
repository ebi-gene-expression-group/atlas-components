import React from 'react'
import PropTypes from 'prop-types'
import URI from 'urijs'

import GeneSearchForm from './GeneSearchForm'

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
    const {data, loading, error} = this.state

    return(
      error ?
        <GeneSearchForm {...data} {...this.props} speciesSelectStatusMessage={`${error.name}: ${error.message}`}/> :
      loading ?
        <GeneSearchForm {...data} {...this.props} speciesSelectStatusMessage={`Fetching species…`}/> :
      // promise fulfilled
        <GeneSearchForm {...data} {...this.props} />
    )
  }

  async componentDidMount() {
    this.setState({ loading: true })
    const url = URI(this.props.speciesEndpoint, this.props.atlasUrl).toString()

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
  atlasUrl: PropTypes.string.isRequired,
  wrapperClassName: PropTypes.string,
  actionEndpoint: PropTypes.string.isRequired,
  onSubmit: PropTypes.func,

  autocompleteClassName: PropTypes.string,
  suggesterEndpoint: PropTypes.string.isRequired,
  defaultValue: PropTypes.shape({
    term: PropTypes.string,
    category: PropTypes.string
  }),

  enableSpeciesSelect: PropTypes.bool,
  speciesEndpoint: PropTypes.string,
  speciesSelectClassName: PropTypes.string,
  defaultSpecies: PropTypes.string
}

FetchLoader.defaultProps = {
  autocompleteClassName: ``,
  defaultValue: {},
  enableSpeciesSelect: false,
  speciesEndpoint: ``,
  speciesSelectClassName: ``,
  defaultSpecies: ``
}

export default FetchLoader
