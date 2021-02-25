import React from 'react'
import ReactDOM from 'react-dom'

import AtlasInformationBanner from '../src/index'

const render = (options, target) => {
  ReactDOM.render(<AtlasInformationBanner {...options} />, document.getElementById(target))
}

export { render }
