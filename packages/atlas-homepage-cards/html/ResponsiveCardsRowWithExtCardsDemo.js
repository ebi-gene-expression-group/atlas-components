import React from 'react'
import ReactDOM from 'react-dom'

import ResponsiveCardsRow, { ExtendableCard } from '../src/index'
import { withFetchLoader } from '@ebi-gene-expression-group/atlas-react-fetch-loader'

const FetchLoadResponsiveCardsRow = withFetchLoader(ResponsiveCardsRow)

const render = (options, target) => {
  ReactDOM.render(
    <FetchLoadResponsiveCardsRow
      CardClass={ExtendableCard}
      {...options}
      host={`${process.env.SERVICE_URL}/gxa/sc/`}
    />,
    document.getElementById(target))
}

export { render }
