import React from 'react'
import ReactDOM from 'react-dom'

import CardContainer from '../src/index.js'

const render = (options, target) => {
  ReactDOM.render(<CardContainer {...options} />, document.getElementById(target))
}

export {render}
