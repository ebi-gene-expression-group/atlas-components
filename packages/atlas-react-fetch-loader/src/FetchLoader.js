import React from 'react'
import PropTypes from 'prop-types'
import styled, { keyframes } from 'styled-components'
import URI from 'urijs'

import CalloutAlert from './CalloutAlert'

const loadingMessage = keyframes`
  0%   { content: "Loading, please wait"; }
  33%  { content: "Loading, please wait."; }
  66%  { content: "Loading, please wait.."; }
  100% { content: "Loading, please wait..."; }
`

const AnimatedLoadingMessage = styled.p`
  ::before {
    content: "Loading, please wait";
    animation: ${loadingMessage} 1s linear infinite alternate;
  }
`

const withFetchLoader = (WrappedComponent) => {
  class FetchLoader extends React.Component {
    constructor(props) {
      super(props)

      this.state = {
        data: null,
        isLoading: true,
        hasError: null
      }
    }

    static getDerivedStateFromProps(props, state) {
      const url = URI(props.resource, props.host).toString()
      // Store URL in state so we can compare when props change.
      // Clear out previously-loaded data (so we don't render stale stuff).
      if (url !== state.url) {
        return {
          data: null,
          loading: true,
          hasError: null,
          url: url
        }
      }

      // No state update necessary
      return null
    }

    async componentDidUpdate(/*prevProps, prevState*/) {
      if (this.state.data === null && this.state.hasError === null) {
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
          isLoading: false,
          hasError: null
        })
      } catch (e) {
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
      const { errorPayloadInsteadOfCallout, ...passThroughProps } = this.props
      const { data, isLoading, hasError } = this.state

      return (
        hasError ?
          errorPayloadInsteadOfCallout ?
            <WrappedComponent {...{...passThroughProps, ...errorPayloadInsteadOfCallout}}/> :
            <CalloutAlert error={hasError} /> :
          isLoading ?
            <AnimatedLoadingMessage/> :
            // Promise fulfilled, merge passed props and merge-overwrite with retrieved data
            <WrappedComponent {...{...passThroughProps, ...data}}/>
      )
    }
  }

  FetchLoader.propTypes = {
    host: PropTypes.string.isRequired,
    resource: PropTypes.string.isRequired,
    errorPayloadInsteadOfCallout: PropTypes.object
  }

  FetchLoader.defaultProps = {
    errorPayloadInsteadOfCallout: null
  }

  return FetchLoader
}

export { withFetchLoader as default, AnimatedLoadingMessage }
