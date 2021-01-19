import React from 'react'
import ReactDOM from 'react-dom'
import FeedbackButton from './FeedbackButton'

const render = (options, target) => {
  ReactDOM.render(<FeedbackButton {...options} />, document.getElementById(target))
}

export { FeedbackButton as default, render}
