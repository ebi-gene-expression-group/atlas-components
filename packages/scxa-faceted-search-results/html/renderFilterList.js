import React from 'react'
import ReactDOM from 'react-dom'

import FilterList from '../src/FilterList'
import ResultElementCard from './ResultElementCard'

const render = (options, target) => {
  ReactDOM.render(<FilterList {...options} ResultElementComponent={ResultElementCard}/>, document.getElementById(target))
}

export {render}
