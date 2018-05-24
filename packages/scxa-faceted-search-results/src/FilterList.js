import React from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash'

import FilterSidebar from './FilterSidebar'

class FilterList extends React.Component {
  constructor(props) {
    super(props)

    // TODO Build initial state of checked filters from props if wrapping in React Router to make it RESTful
    this.state = {
      selectedFacets: {}
    }

    this._handleChange = this._handleChange.bind(this)
  }

  _handleChange(facetGroupName, facets) {
    const nextSelectedFacets = _.defaultsDeep({}, this.state.selectedFacets)
    nextSelectedFacets[facetGroupName] = facets.map((facet) => facet.value)  // Store values only, discard labels

    this.setState({
      selectedFacets: nextSelectedFacets
    })
  }

  render() {
    const {results, checkboxFacetGroups, hideFacetGroupNames, ResultElementComponent, resultsMessage} = this.props
    const {selectedFacets} = this.state

    const filteredElements =
      results.filter((result) =>
        // Results that have at least one matching facet (some) in all (every) selected groups with at least one selected item
        Object.entries(selectedFacets)
          .filter(([selectedFacetName, selectedFacetValues]) => selectedFacetValues.length)
          .every(([selectedFacetName, selectedFacetValues]) =>
            result.facets.some((resultFacet) =>
              selectedFacetName === resultFacet.group && selectedFacetValues.includes(resultFacet.value))))
          .map((result) => result.element)

      const resultsHaveFacets =
        results.some((result) =>
          result.facets &&
          result.facets.some((facet) =>
            typeof(facet.group) === `string` && typeof(facet.value) === `string` && typeof(`label`) === `string` &&
            facet.group.length && facet.value.length && facet.value.length))

    return(
      <div className={`expanded row`}>
        { resultsHaveFacets &&
          <div className={`small-12 medium-2 columns`}>
            <FilterSidebar {...{checkboxFacetGroups, hideFacetGroupNames}}
                           facets={_(results).flatMap('facets').value()}
                           onChange={this._handleChange}/>
          </div>
        }
        <div className={resultsHaveFacets ? `small-12 medium-10 columns` : `small-12 columns`}>
          <h3>{resultsMessage}</h3>
            {filteredElements.map((element, index) => <div key={index}><ResultElementComponent {...element}/></div>)}
        </div>
      </div>
    )
  }
}

FilterList.propTypes = {
  // A list of results from where facets can be inferred by inspecting each result’s facets field
  // Supplied by FetchLoader, or set manually for testing
  results: PropTypes.arrayOf(PropTypes.shape({
    element: PropTypes.object.isRequired,
    facets: PropTypes.arrayOf(PropTypes.shape({
      group: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired
    }))
  })).isRequired,
  checkboxFacetGroups: PropTypes.arrayOf(PropTypes.string),
  hideFacetGroupNames: PropTypes.arrayOf(PropTypes.string),
  ResultElementComponent: PropTypes.func.isRequired, // must be a React.Component, sadly there’s no such prop :(
  resultsMessage: PropTypes.string
}

FilterList.defaultProps = {
  checkboxFacetGroups: [],
  hideFacetGroupNames: []
}

export default FilterList
