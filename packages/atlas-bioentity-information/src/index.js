// import BioentityInformation from './BioentityInformation.js'
//
// export default BioentityInformation

import React from 'react'
import ReactDOM from 'react-dom'

import BioentityInformation from './BioentityInformation.js'

const render = (options, target) => {
    ReactDOM.render(<BioentityInformation {...options} />, document.getElementById(target))
}

export {BioentityInformation as default, render}


