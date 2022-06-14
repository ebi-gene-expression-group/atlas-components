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
        error: null
      }
    }

    static getDerivedStateFromProps(props, state) {
      const url = URI(props.resource, props.host).query(props.query).toString()
      // Store URL in state so we can compare when props change.
      // Clear out previously-loaded data (so we don't render stale stuff).
      if (url !== state.url) {
        return {
          data: null,
          isLoading: true,
          error: null,
          url: url
        }
      }

      // No state update necessary
      return null
    }

    async componentDidUpdate(/*prevProps, prevState*/) {
      if (this.state.data === null && this.state.error === null) {
        await this._loadAsyncData(URI(this.props.resource, this.props.host).query(this.props.query).toString())
      }
    }

    async componentDidMount() {
      await this._loadAsyncData(URI(this.props.resource, this.props.host).query(this.props.query).toString())
    }

    async _loadAsyncData(url) {
      try {
        const response = await fetch(url)
        // The promise returned by fetch may be fulfilled with a 4xx or 5xx return code, so we need to explicitly check ok
        if (!response.ok) {
          throw new Error(`${url} => ${response.status}`)
        }

        const data = this.props.raw ? await response.text() : await response.json()

        if (!this.props.raw) {
          Object.keys(this.props.renameDataKeys)
            .forEach(key => {
              // Defend against accidental same-value fields: { foo: "foo" }
              if (data[key]) {
                const dataKey = data[key]
                delete data[key]
                Object.assign(data, {[this.props.renameDataKeys[key]]: dataKey })
              }
            })
        }

        this.setState({
          data: data,
          isLoading: false,
          error: null
        })
      } catch (e) {
        this.setState({
          data: null,
          isLoading: false,
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

    render() {
      const { errorPayloadProvider, loadingPayloadProvider, fulfilledPayloadProvider, ...passThroughProps } = this.props
      const { data, isLoading, error } = this.state

      return (
        error ?
          errorPayloadProvider ?
            <WrappedComponent {...{...passThroughProps, ...errorPayloadProvider(error)}}/> :
            <CalloutAlert error={error} /> :
        isLoading ?
          loadingPayloadProvider ?
            <WrappedComponent {...{...passThroughProps, ...loadingPayloadProvider()}}/> :
            <AnimatedLoadingMessage/> :
            // Promise fulfilled, merge passed props and merge-overwrite with retrieved data
          <WrappedComponent {...{...passThroughProps, ...data, ...fulfilledPayloadProvider(data)}}/>
      )
    }
  }

  FetchLoader.propTypes = {
    host: PropTypes.string.isRequired,
    resource: PropTypes.string.isRequired,
    query: PropTypes.object,
    loadingPayloadProvider: PropTypes.func,
    errorPayloadProvider: PropTypes.func,
    fulfilledPayloadProvider: PropTypes.func,
    renameDataKeys: PropTypes.objectOf(PropTypes.string),
    raw: PropTypes.bool
  }

  FetchLoader.defaultProps = {
    query: {},
    loadingPayloadProvider: null,
    errorPayloadProvider: null,
    fulfilledPayloadProvider: () => {},
    renameDataKeys: {},
    raw: false
  }

  return FetchLoader
}

export {withFetchLoader as default, AnimatedLoadingMessage }
