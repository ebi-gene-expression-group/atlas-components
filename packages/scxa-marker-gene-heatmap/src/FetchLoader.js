import React from 'react'
import PropTypes from 'prop-types'
import URI from 'urijs'

class FetchLoader extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      data: null,
      isLoading: true,
      hasError: null
    }
  }

  async componentDidMount() {
    const url = URI(this.props.resource, this.props.host).toString()

    try {
      const response = await fetch(url)

      if (!response.ok) {
        throw new Error(`${url} => ${response.status}`)
      }

      this.setState({
        data: await response.json(),
        isLoading: false,
        hasError: null
      })
    } catch(e) {
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

  componentDidCatch(error, info) {
    this.setState({
      hasError: {
        description: `There was a problem rendering this component.`,
        name: error.name,
        message: `${error.message} – ${info}`
      }
    })
  }

  render() {
    const { data, isLoading, hasError } = this.state

    return (
      <div>
        {hasError}
      </div>
    )
  }
}

FetchLoader.propTypes = {
  host: PropTypes.string,
  resource: PropTypes.string
}

export default FetchLoader
