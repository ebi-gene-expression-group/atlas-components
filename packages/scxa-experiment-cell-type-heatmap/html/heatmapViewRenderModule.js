import React from 'react'
import ReactDOM from 'react-dom'

import HeatmapView from '../src/index.js'

const render = (options, target) => {
  ReactDOM.render(<HeatmapView {...options}/>, document.getElementById(target))
}

export { render }
