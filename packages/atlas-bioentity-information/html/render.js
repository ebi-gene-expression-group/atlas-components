import React from 'react'
import ReactDOM from 'react-dom'

import BioentityInformation from '../src/index.js'

const render = (options, target) => {
  ReactDOM.render(<BioentityInformation {...options} />, document.getElementById(target))
}

export {render}
