import React from 'react'
import PropTypes from 'prop-types'

const FilterList = ({ filteredResults, resultsMessage, ResultsHeaderClass, ResultElementClass }) => (
  <div role={`filterList`}>
    <h4>{resultsMessage}</h4>
    { filteredResults.length && <ResultsHeaderClass/> }
    { filteredResults.map((element, index) => <div key={index}><ResultElementClass {...element}/></div>) }
  </div>
)

FilterList.propTypes = {
  filteredResults: PropTypes.arrayOf(PropTypes.object).isRequired,
  resultsMessage: PropTypes.string,
  ResultsHeaderClass: PropTypes.func,
  ResultElementClass: PropTypes.func.isRequired
}

FilterList.defaultProps = {
  resultsMessage: ``
}

export default FilterList
