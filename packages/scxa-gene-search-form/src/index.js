
import React from 'react'
import ReactDOM from 'react-dom'

import GeneSearchFormWithFetchLoader from './FetchLoader'

const render = (options, target) => {
  ReactDOM.render(<GeneSearchFormWithFetchLoader {...options} />, document.getElementById(target))
}

export { GeneSearchFormWithFetchLoader as default, render }
