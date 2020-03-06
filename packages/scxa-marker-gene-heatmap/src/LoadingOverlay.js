import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import URI from 'urijs'

import flaskLoaderSvg from './svg/flask-loader.svg'

const TranslucentOverlay = styled.div`
  display: ${props => props.show ? `flex` : `none`};
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(255,255,255,0.8);
  align-items: center;
  justify-content: center;
  flex-direction: column;
 `

const LoadingOverlay = ({show, resourcesUrl}) =>
  <TranslucentOverlay show={show}>
    <p>Loading, please wait...</p>
    <img src={URI(flaskLoaderSvg, resourcesUrl).toString()}/>
  </TranslucentOverlay>

LoadingOverlay.propTypes = {
  show: PropTypes.bool.isRequired,
  resourcesUrl: PropTypes.string
}

LoadingOverlay.defaultProps = {
  resourcesUrl: ``
}

export default LoadingOverlay
