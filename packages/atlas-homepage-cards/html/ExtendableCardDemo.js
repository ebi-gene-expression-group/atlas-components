import React from 'react'
import ReactDOM from 'react-dom'

import { ExtendableCard } from '../src/index'

const render = (options, target) => {
  ReactDOM.render(<ExtendableCard {...options} />, document.getElementById(target))
}

export { render }
