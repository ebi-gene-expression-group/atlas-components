import React from 'react'
import PropTypes from 'prop-types'
import {ResultPropTypes} from './ResultPropTypes'

const FilterList = ({filteredResults, resultsMessage, ResultsHeaderClass, ResultElementClass}) => {
  const filteredElements = filteredResults.map((result) => result.element)

  return (
    <div>
      <h4>{resultsMessage}</h4>
      { filteredElements.length && ResultsHeaderClass && <ResultsHeaderClass /> }
      { filteredElements.map((element, index) => <div key={index}><ResultElementClass {...element}/></div>) }
    </div>
  )
}

FilterList.propTypes = {
  filteredResults: PropTypes.arrayOf(ResultPropTypes).isRequired,
  resultsMessage: PropTypes.string,
  ResultsHeaderClass: PropTypes.func,
  ResultElementClass: PropTypes.func.isRequired
}

FilterList.defaultProps = {
  resultsMessage: ``
}

export default FilterList
