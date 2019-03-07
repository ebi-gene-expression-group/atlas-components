import React from 'react'
import ReactTooltip from 'react-tooltip'
import PropTypes from 'prop-types'
import _ from 'lodash'

import FilterSidebar from './FilterSidebar'
import FilterList from './FilterList'

import {ResultPropTypes} from './ResultPropTypes'

class FacetedSearchContainer extends React.Component {
  constructor(props) {
    super(props)

    const uniqueFacets = _(props.results)
      .flatMap(`facets`)
      .compact()   // lodash will emit undefined if `facets` doesn’t exist :/
      .uniqWith(_.isEqual)
      .map((facet) => ({...facet, disabled: false}))
      .value()

    const groupedResultFacets = props.results.map(result => _.groupBy(result.facets, `group`))
    const groupedUniqueFacets = Object.keys(_.groupBy(uniqueFacets, `group`))

    const sharedFacets =
      groupedUniqueFacets.filter(group =>
        !groupedResultFacets.every((result, idx, results) =>
          _.isEqual(result[group], results[0][group])))

    this.state = {
      facets: uniqueFacets.filter(facet => sharedFacets.includes(facet.group)),
      selectedFacets: {} // TODO (?) Build initial state of checked filters from props if wrapped in React Router,
    }

    this._handleChange = this._handleChange.bind(this)
    this._filterResults = this._filterResults.bind(this)
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
    const {facets, selectedFacets} = this.state
    const {checkboxFacetGroups, ResultElementClass, ResultsHeaderClass, resultsMessage, sortTitle} = this.props

    return(
      <div className={`row expanded`}>
        {
          facets.length > 0 &&
          <div className={`small-12 medium-4 large-3 columns`}>
            <FilterSidebar {...{checkboxFacetGroups, facets}} onChange={this._handleChange}/>
          </div>
        }

        <div className={`small-12 medium-8 large-9 columns`}>
          <FilterList {...{resultsMessage, ResultElementClass, ResultsHeaderClass, sortTitle}}
            filteredResults={this._filterResults(selectedFacets)}/>
        </div>
        <ReactTooltip effect={`solid`}/>
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
  // Must be classes that extends React.Component, sadly there’s no such prop type :(
  // See also https://stackoverflow.com/questions/45315918/react-proptypes-component-class
  ResultsHeaderClass: PropTypes.func,
  ResultElementClass: PropTypes.func.isRequired,
	sortTitle: PropTypes.string
}

FacetedSearchContainer.defaultProps = {
  resultsMessage: ``,
  checkboxFacetGroups: []
}

export default FacetedSearchContainer
