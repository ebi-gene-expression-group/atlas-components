import React from 'react'
import ReactDOM from 'react-dom'

import GeneSearchResults from '../src/index'

const render = (options, target) => {
  ReactDOM.render(<GeneSearchResults {...options} />, document.getElementById(target))
}

export {render}
