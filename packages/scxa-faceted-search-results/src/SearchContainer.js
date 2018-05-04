import React from 'react'
import PropTypes from 'prop-types'

import FilterSidebar from './FilterSidebar'
import ResultsList from './ResultsList'

class SearchContainer extends React.Component {
  constructor(props) {
    super(props)

    // Build initial state of selected filters from the attributes props, keeps track of what filters have been checked
    // in the sidebar
    this.state = {
      selectedAttributes: []
    }
  }

  render() {
    <div className={`row`}>
      <div className={`small-12 medium-4 large-2 columns`}>
        {/*<FilterSidebar />*/}
      </div>
      <div className={`small-12 medium-8 large-10 columns`}>
        {/*<ResultsList />*/}
      </div>
    </div>
  }
}

SearchContainer.propTypes = {
  // A list of results from where facets can be inferred by inspecting each result’s attribute field
  // Supplied by FetchLoader, or set manually for testing
}

export default SearchContainer
