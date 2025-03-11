import React from 'react'
import ReactDOM from 'react-dom'

import LabelledSelect from '../src/LabelledSelect'

import { render as geneSearchFromRender } from '../src/index';

const render = (options, target) => {
  geneSearchFromRender({...options, host: `${process.env.SERVICE_URL}/gxa/sc/`} , target);
};

export { render }

const renderLabelledSelect = (options, target) => {
  ReactDOM.render(<LabelledSelect {...options} />, document.getElementById(target))
}

export { renderLabelledSelect }
