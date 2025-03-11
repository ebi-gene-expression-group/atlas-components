import React from 'react'
import ReactDOM from 'react-dom'
import BioentityInformation from '../src/index'

import { withFetchLoader } from '@ebi-gene-expression-group/atlas-react-fetch-loader'
const BioentityInformationWithFetchLoader = withFetchLoader(BioentityInformation)

const render = (options, target) => {
  ReactDOM.render(
    <BioentityInformationWithFetchLoader
      {...options}
      host={`https://wwwdev.ebi.ac.uk/gxa/sc/`}
      resource={`json/bioentity-information/${options.geneId}`}/>,
    document.getElementById(target))
}

export { render }
