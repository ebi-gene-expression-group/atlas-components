import React from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash'

import FilterSidebar from './FilterSidebar'
import FilterList from './FilterList'

import {ResultPropTypes} from './ResultPropTypes'

class FacetedSearchContainer extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      facets:
        _(props.results)
          .flatMap(`facets`)
          .compact()   // lodash will emit undefined if `facets` doesn’t exist :/
          .uniqWith(_.isEqual)
          .map((facet) => ({...facet, disabled: false}))
          .value(),
      selectedFacets: {}  // TODO (?) Build initial state of checked filters from props if wrapped in React Router
    }

    this._handleChange = this._handleChange.bind(this)
  }

  _filterResults(facets) {
    return this.props.results.filter((result) =>
      // Leave the results that, for every group, have at least one matching property within that group
      // Note: every returns true for empty arrays
      Object.entries(facets)
        .every(
          ([facetGroup, facetValues]) =>
            result.facets.some(
              (resultFacet) =>
                facetGroup === resultFacet.group && facetValues.map(f => f.value).includes(resultFacet.value))))
  }

  _hasNoResults(selectedFacets, additionalFacet) {
    const mergedFacets =
      _.mergeWith(
        _.defaultsDeep({}, selectedFacets),
        {[additionalFacet.group]: additionalFacet},
        (objValue, srcValue) => _.uniq((objValue || []).concat(srcValue))
      )

    return this._filterResults(mergedFacets).length === 0
  }

  _disableEnabledFacetsWithNoResults(selectedFacets, facetGroup) {
    return _.cloneDeep(this.state.facets)
      .map((facet) => ({
        ...facet,
        disabled:
          facet.group !== facetGroup ?
            facet.disabled ? true : this._hasNoResults(selectedFacets, facet) :
            facet.disabled
      }))
  }

  _enableDisabledFacetsWithResults(selectedFacets, facetGroup) {
    return _.cloneDeep(this.state.facets)
      .map((facet) => ({
        ...facet,
        disabled:
          facet.group !== facetGroup ?
            facet.disabled ? this._hasNoResults(selectedFacets, facet) : false :
            facet.disabled
      }))
  }

  _handleChange(facetGroup, selectedFacetsInGroup) {
    const _selectedFacets = _.defaultsDeep({}, this.state.selectedFacets)
    _selectedFacets[facetGroup] = selectedFacetsInGroup

    const nextSelectedFacets =
       Object.keys(_selectedFacets)
         .filter((key) => _selectedFacets[key] && _selectedFacets[key].length > 0)
         .reduce((acc, key) => {
           acc[key] = _selectedFacets[key]
           return acc
         }, {})

    const previousNumberOfSelectedFacetsInGroup = this.state.selectedFacets[facetGroup] ?
      this.state.selectedFacets[facetGroup].length : 0

    let nextFacets = {}
    if (_selectedFacets[facetGroup].length > previousNumberOfSelectedFacetsInGroup) {
      if (_selectedFacets[facetGroup].length === 1) {
        // First facet in group selected: less results, disable enabled facets
        nextFacets = this._disableEnabledFacetsWithNoResults(nextSelectedFacets, facetGroup)
      } else {
        // Add a second or subsequent facet to a group: more results, enable disabled facets
        nextFacets = this._enableDisabledFacetsWithResults(nextSelectedFacets, facetGroup)
      }
    } else {
      if (_selectedFacets[facetGroup].length === 0) {
        // No facets in group selected: more results, enable disabled facets
        nextFacets = this._enableDisabledFacetsWithResults(nextSelectedFacets, facetGroup)
      } else {
        // Facet has been deselected but others in group remain: less results, disable enabled facets
        nextFacets = this._disableEnabledFacetsWithNoResults(nextSelectedFacets, facetGroup)
      }
    }

    this.setState({
       facets: nextFacets,
       selectedFacets: nextSelectedFacets
    })
  }

  render() {
    const {facets} = this.state

    const {checkboxFacetGroups, ResultElementClass, resultsMessage} = this.props
    const {selectedFacets} = this.state

    return(
      <div className={`row expanded`}>
        {
          facets.length > 0 &&
          <div className={`small-12 medium-4 columns`}>
            <FilterSidebar {...{facets, checkboxFacetGroups}} onChange={this._handleChange}/>
          </div>
        }

        <div className={`small-12 medium-8 columns`}>
          <FilterList {...{resultsMessage, ResultElementClass}}
                      filteredResults={this._filterResults(selectedFacets)}/>
        </div>
      </div>
    )
  }
}

FacetedSearchContainer.propTypes = {
  // A list of results from where facets can be inferred by inspecting each result’s facets field
  // Supplied by FetchLoader, or set manually for testing
  results: PropTypes.arrayOf(ResultPropTypes).isRequired,
  checkboxFacetGroups: PropTypes.arrayOf(PropTypes.string),
  resultsMessage: PropTypes.string,
  // Must be a class that extends React.Component, sadly there’s no such prop type :(
  // See also https://stackoverflow.com/questions/45315918/react-proptypes-component-class
  ResultElementClass: PropTypes.func.isRequired
}

FacetedSearchContainer.defaultProps = {
  resultsMessage: ``,
  checkboxFacetGroups: []
}

export default FacetedSearchContainer
