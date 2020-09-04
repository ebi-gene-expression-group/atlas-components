import React from 'react'
import ReactDOM from 'react-dom'

import ScientificNotationNumber from '../src/index.js'

const render = (options, target) => {
  ReactDOM.render(<ScientificNotationNumber {...options} />, document.getElementById(target))
}

export {render}
