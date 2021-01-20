import React from 'react'
import ReactDOM from 'react-dom'

import AnatomogramExperimentTable from '../src/index.js'
import svgsMetadata from './svgsMetadata.json'

const unique = (value, index, self) => self.indexOf(value) === index

const getAllIds = (species) =>
  svgsMetadata
    .filter((svgMetadata) => svgMetadata.species === species)
    .reduce((acc, svgMetadata) => acc.concat(svgMetadata.ids), [])
    .filter(unique)
    .sort()

const render = (options, target) => {
  ReactDOM.render(<AnatomogramExperimentTable {...options}
    showIds={getAllIds(options.species)} />,
    document.getElementById(target))
}

export { render }
