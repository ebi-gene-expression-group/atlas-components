import React from 'react'
import ReactDOM from 'react-dom'

import CellTypeWheel from '../src/index'

import cftr from './data/cftr-sunburst.json'
import lungany from './data/lung-any-sunburst.json'
import lung from './data/lung-sunburst.json'
import pancreas from './data/pancreas-sunburst.json'
import covid19 from './data/covid19-sunburst.json'
import leukocyte from './data/leukocyte-sunburst.json'
import cancer from './data/cancer-sunburst.json'
import tcell from './data/tcell-sunburst.json'

const data = {
  cftr: cftr,
  lungany: lungany,
  lung: lung,
  pancreas: pancreas,
  covid19: covid19,
  leukocyte: leukocyte,
  cancer: cancer,
  tcell: tcell
}

const render = (options, dataKey, target) => {
  ReactDOM.render(<CellTypeWheel {...options} data={data[dataKey]} />, document.getElementById(target))
}

export { render }
