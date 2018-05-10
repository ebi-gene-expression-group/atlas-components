import React from 'react'

import ResultPropTypes from './ResultPropTypes'

const ResultItem = ({text}) =>
  <div>
    <p>{text}</p>
  </div>

ResultItem.propTypes = ResultPropTypes

export default ResultItem
