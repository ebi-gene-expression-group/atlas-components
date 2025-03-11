import React from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'

import ResponsiveCardsRow from '../src/index'
import { withFetchLoader } from '@ebi-gene-expression-group/atlas-react-fetch-loader'

// Component to “unfold” species-summary payload to conform to ResponsiveCardsRow props
const AnimalSpeciesSummary = ({speciesSummary, ...options}) =>
  <ResponsiveCardsRow
    {...speciesSummary[0]}
    {...options}
  />

AnimalSpeciesSummary.propTypes = {
  speciesSummary: PropTypes.array
}

const FetchLoadAnimalSpeciesSummary = withFetchLoader(AnimalSpeciesSummary)

const render = (options, target) => {
  ReactDOM.render(<FetchLoadAnimalSpeciesSummary {...options} host={`${process.env.SERVICE_URL}/gxa/sc/`}/>, document.getElementById(target))
}

export { render }
