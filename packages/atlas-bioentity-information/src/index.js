import React from 'react'
import ReactDOM from 'react-dom'

import { withFetchLoader } from '@ebi-gene-expression-group/atlas-react-fetch-loader'

import BioentityInformation from './BioentityInformation'

const BioentityInformationWithFetchLoader = withFetchLoader(BioentityInformation)
const render = (options, target) => {
  ReactDOM.render(<BioentityInformationWithFetchLoader {...options}/>, document.getElementById(target))
}

export { BioentityInformation as default, render }
