import React from 'react'
import PropTypes from 'prop-types'

import FilterSidebar from './FilterSidebar'
import ResultsList from './ResultsList'
import ResultItem from './results/ResultItem'

class FilterList extends React.Component {
  constructor(props) {
    super(props)

    // TODO Build initial state of checked filters from props if wrapping in React Router to make it RESTful
    this.state = {
      selectedFacets: {}
    }

    this._handleChange = this._handleChange.bind(this)
  }

  _handleChange(facetName, facetItems) {
    const selectedFacets = Object.assign({}, this.state.selectedFacets)
    selectedFacets[facetName] = facetItems.map((facetItem) => facetItem.value)  // We don’t care about the labels

    const selectedFacetsWithoutEmptyFacets =
      Object.entries(selectedFacets)
        .filter(([key, value]) => value.length) // remove empty facets
        .reduce((acc, entry) => Object.assign(acc, { [entry[0]]: entry[1] }), {}) // Transform arr of entries to object

    this.setState({
      selectedFacets: selectedFacetsWithoutEmptyFacets
    })
  }

  render() {
    const obj = this.props.results
      .map((result) => result.filterAttributes)
      .reduce((acc, filterAttributes) => acc.concat(filterAttributes), [])  //flatten
      .reduce((acc, filterAttribute) =>
        {
          const attribute = { value: filterAttribute.value, label: filterAttribute.label }

          acc[filterAttribute.group] = acc[filterAttribute.group] ?
            acc[filterAttribute.group].some((el) => el.value === attribute.value) ? // Skip duplicates
              acc[filterAttribute.group] :
              acc[filterAttribute.group].concat(attribute) :
            [attribute]

          return acc
        }, {})

    // obj has the shape, e.g. { disease: [{name: "cancer", label: "Cancer"}, {name: "asthma", label: "Asthma"}}
    // We transform it to put the keys as facetName
    const facetGroups = Object.entries(obj).map(([key, value]) => ({ facetName: key, facetItems: value }))

    const filteredResults =
      this.props.results
        .filter((result) =>
          Object.entries(this.state.selectedFacets).every(([facetName, facetValues]) =>
            result.filterAttributes.some((filterAttribute) =>
              facetName === filterAttribute.group && facetValues.includes(filterAttribute.value))))

    return(
      <div className={`row`}>
        <div className={`small-12 medium-4 columns`}>
          <FilterSidebar hideGroupNames={[`Marker Genes`]}
                         asCheckboxes={[`Marker Genes`]}
                         facetGroups={facetGroups}
                         onChange={this._handleChange}/>
        </div>
        <div className={`small-12 medium-8 columns`}>
          <ResultsList results={filteredResults.map((result) => ({...result.result}))} ResultItem={ResultItem} keyField={`text`}/>
        </div>
      </div>
    )
  }
}

FilterList.propTypes = {
  // A list of results from where facets can be inferred by inspecting each result’s attribute field
  // Supplied by FetchLoader, or set manually for testing
  results: PropTypes.arrayOf(PropTypes.shape({
    result: ResultItem.propTypes,
    filterAttributes: PropTypes.arrayOf(PropTypes.shape({
      group: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired
    }))
  }))
}

export default FilterList
