import React from 'react'
import ReactDOM from 'react-dom'

import DemoComponent from './DemoComponent'
import { withFetchLoader } from '../src/index'

import '@babel/polyfill'
import fetchMock from 'fetch-mock'

fetchMock.get(
  `http://foo.bar/path/yolo/1337`,
  `{"message": "Foobar", "footer": "Overwritten prop retrieved from data"}`)

const FetchLoadDemoComponent = withFetchLoader(DemoComponent)

const render = (options, target) => {
  ReactDOM.render(<FetchLoadDemoComponent {...options} />, document.getElementById(target))
}

export { render }
