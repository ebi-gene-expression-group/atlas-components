import React from 'react'
import ReactDOM from 'react-dom'

import GeneSearchForm from '../src/index'
import LabelledSelect from '../src/LabelledSelect'

const render = (options, target) => {
  ReactDOM.render(<GeneSearchForm {...options} />, document.getElementById(target))
}

const renderLabelledSelect = (options, target) => {
  ReactDOM.render(<LabelledSelect {...options} />, document.getElementById(target))
}

export { render, renderLabelledSelect }
