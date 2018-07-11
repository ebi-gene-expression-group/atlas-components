import React from 'react'
import ReactDOM from 'react-dom'

import GeneSearchForm from '../src/index.js'

const render = (options, target) => {
  ReactDOM.render(<GeneSearchForm {...options} />, document.getElementById(target))
}

export {render}
