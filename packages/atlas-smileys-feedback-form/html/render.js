import React from 'react'
import ReactDOM from 'react-dom'

import FeedbackForm from '../src/index.js'

const render = (options, target) => {
  ReactDOM.render(<FeedbackForm {...options} />, document.getElementById(target))
}

export {render}
