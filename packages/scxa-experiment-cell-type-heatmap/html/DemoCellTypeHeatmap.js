import React from 'react'
import ReactDOM from 'react-dom'

import HeatmapView from '../src/index.js'

const props = {
  resource: `json/experiments/E-MTAB-5061/marker-genes/cell-types?organismPart=http://purl.obolibrary.org/obo/UBERON_0001264`,
  host: `http://localhost:8080/gxa/sc/`,
  props: {
    species: `Homo sapiens`,
    hasDynamicHeight: true,
    heatmapRowHeight: 20,
    wrapperClassName: `row expanded`,
  }
}

const render = (options, target) => {
  ReactDOM.render(<HeatmapView {...props}/>, document.getElementById(target))
}

export {render}
