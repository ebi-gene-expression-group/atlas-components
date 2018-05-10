import React from 'react'
import PropTypes from 'prop-types'

import ResultPropTypes from './results/ResultPropTypes'

const ResultsList = ({ResultItem, keyField, results}) =>
  results.map((result) => <ResultItem {...result} key={result[keyField]} />)

ResultsList.propTypes = {
  results: PropTypes.arrayOf(ResultPropTypes).isRequired,
  keyField: PropTypes.string.isRequired,
  ResultItem: PropTypes.func.isRequired
}

export default ResultsList
