import React from 'react'
import ReactDOM from 'react-dom'

import TSnePlotWidget from './TSnePlotWidget'
import {withFetchLoader} from "@ebi-gene-expression-group/atlas-react-fetch-loader"

const TSnePlotWidgetWithFetchLoader = withFetchLoader(TSnePlotWidget)
const render = (options, target) => {
    ReactDOM.render(
        <TSnePlotWidgetWithFetchLoader
            {...options}
            resource={`json/experiments/${options.experimentAccession}/metadata/tsneplot`}
            host={`https://www.ebi.ac.uk/gxa/sc/`}
        />,
        document.getElementById(target))
}

export { render}
