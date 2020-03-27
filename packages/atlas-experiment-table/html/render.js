import React from 'react'
import ReactDOM from 'react-dom'

import { TableManager, TableManagerRouter, loadExperimentDownloadModule, _validateAndDownloadExperimentFiles } from '../src/index.js'

const render = (options, target) => {
  ReactDOM.render(<TableManager { ...options } />, document.getElementById(target))
}

const renderRouter = (options, target) => {
  ReactDOM.render(<TableManagerRouter { ...options } />, document.getElementById(target))
}

export { render, renderRouter, loadExperimentDownloadModule, _validateAndDownloadExperimentFiles }
