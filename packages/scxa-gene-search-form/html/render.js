import React from 'react'
import ReactDOM from 'react-dom'

import LabelledSelect from '../src/LabelledSelect'

const renderLabelledSelect = (options, target) => {
  ReactDOM.render(<LabelledSelect {...options} />, document.getElementById(target))
}

export { render } from '../src/index'
export { renderLabelledSelect }
