import React from 'react'
import ReactDOM from 'react-dom'

import { cellTypeHeatmapView } from '../src/cellTypeHeatmapView'

const render = (options, target) => {
  return ReactDOM.render(
    <div>
      { cellTypeHeatmapView(options.props, options.state) }
    </div>,
    document.getElementById(target))
}

export { render }