import React from 'react'
import ReactDOM from 'react-dom'

import AnatomogramExperimentTable from '../src/index.js'
import svgsMetadata from './svgsMetadata.json'

import { withFetchLoader } from '@ebi-gene-expression-group/atlas-react-fetch-loader'

const AnatomogramExperimentTableWithFetchLoader = withFetchLoader(AnatomogramExperimentTable)

const unique = (value, index, self) => self.indexOf(value) === index

const getAllIds = (species) =>
  svgsMetadata
    .filter((svgMetadata) => svgMetadata.species === species)
    .reduce((acc, svgMetadata) => acc.concat(svgMetadata.ids), [])
    .filter(unique)
    .sort()

const render = (options, target) => {
  console.log("options=", options);
  ReactDOM.render(<AnatomogramExperimentTableWithFetchLoader
    {...options}
    host={options.dataHost}
    resource={`json/experiments/hca/human/`}
    showIds={getAllIds(options.species)}
    description={`Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Et tortor consequat id porta nibh venenatis cras. Eu facilisis sed odio morbi quis commodo odio aenean. Nibh praesent tristique magna sit.`} />,
    document.getElementById(target))
}

export { render }
