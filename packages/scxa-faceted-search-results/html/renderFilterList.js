import React from 'react'
import ReactDOM from 'react-dom'

import FilterList from '../src/FilterList'

const render = (options, target) => {
  ReactDOM.render(<FilterList {...options} />, document.getElementById(target))
}

export {render}
