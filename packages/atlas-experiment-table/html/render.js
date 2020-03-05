import React from 'react'
import ReactDOM from 'react-dom'

import { TableManager, TableManagerSpa } from '../src/index.js'

const render = (options, target) => {
  ReactDOM.render(<TableManager { ...options } />, document.getElementById(target))
}

const renderSpa = (options, target) => {
  ReactDOM.render(<TableManagerSpa { ...options } />, document.getElementById(target))
}

export { render, renderSpa }
