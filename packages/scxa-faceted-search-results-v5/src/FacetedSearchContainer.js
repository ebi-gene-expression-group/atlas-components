import React from 'react'
import PropTypes from 'prop-types'

import FilterSidebar from './FilterSidebar'

import CheckboxFacetGroupsDefaultProps from './facetgroups/CheckboxFacetGroupsDefaultProps'
import MultiSelectDropdownFacetGroupsDefaultProps from './facetgroups/MultiSelectDropdownFacetGroupsDefaultProps'
import { withFetchLoader } from '@ebi-gene-expression-group/atlas-react-fetch-loader'
import FilterList from './FilterList'
import { cloneDeep } from 'lodash'

const FilterListWithFetchLoader = withFetchLoader(FilterList)

class FacetedSearchContainer extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      queryParams: props.queryParams,
      changedFacetGroup: null,
      facetsOfChangedGroup: []
    }
    this.onChange = this.onChange.bind(this)
  }

  onChange(filterType, selectedFacets, facetsOfChangedGroup = []) {
    const queryStringObject = this.state.queryParams

    if (selectedFacets !== null && selectedFacets.length > 0) {
      const selectedValues = filterType === `isMarkerGenes` ?
        [`true`] :
        selectedFacets.map(selectedFacet => selectedFacet.value)
      queryStringObject[filterType] = selectedValues
    } else {
      // if selectedFacets empty, then delete the type from query params
      delete queryStringObject[filterType]
    }

    this.setState({
      queryParams: queryStringObject,
      changedFacetGroup: filterType,
      facetsOfChangedGroup
    })
  }

  render() {
    const {
      checkboxFacetGroups, multiSelectDropdownFacetGroups, host, filterListEndpoint,
      ResultsHeaderClass, ResultElementClass, sortTitle
    } = this.props
    const queryParams = this.state.queryParams
    const changedFacetGroup = this.state.changedFacetGroup
    const facetsOfChangedGroup = this.state.facetsOfChangedGroup

    return (
      <div className={`row expanded`}>
        <div className={`small-12 medium-4 large-3 columns`}>
          <FilterSidebar onChange={this.onChange}
            {...{
              checkboxFacetGroups,
              multiSelectDropdownFacetGroups,
              host,
              queryParams,
              changedFacetGroup,
              facetsOfChangedGroup
            }}/>
        </div>
        <div className={`small-12 medium-8 large-9 columns`}>
          <FilterListWithFetchLoader
            host={host}
            resource={filterListEndpoint}
            query={queryParams}
            fulfilledPayloadProvider={ (payload) => (
              {
                filteredResults: payload.results,
                resultMessage: payload.resultMessage
              }
            )
            }
            {...{ ResultElementClass, ResultsHeaderClass, sortTitle }}
          />
        </div>
      </div>
    )
  }
}

FacetedSearchContainer.propTypes = {
  host: PropTypes.string.isRequired,
  queryParams: PropTypes.object,
  checkboxFacetGroups: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string.required,
    description: PropTypes.string.required,
    endpoint: PropTypes.string.isRequired,
    queryParamName: PropTypes.string.isRequired,
    payloadConversion: PropTypes.func
  })
  ),
  multiSelectDropdownFacetGroups: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string.required,
    description: PropTypes.string.required,
    endpoint: PropTypes.string.isRequired,
    queryParamName: PropTypes.string.isRequired,
    payloadConversion: PropTypes.func
  })
  ),
  filterListEndpoint: PropTypes.string.isRequired,
  // Must be classes that extends React.Component, sadly there’s no such prop type :(
  // See also https://stackoverflow.com/questions/45315918/react-proptypes-component-class
  ResultsHeaderClass: PropTypes.func.isRequired,
  ResultElementClass: PropTypes.func.isRequired
}

FacetedSearchContainer.defaultProps = {
  checkboxFacetGroups: CheckboxFacetGroupsDefaultProps,
  multiSelectDropdownFacetGroups: MultiSelectDropdownFacetGroupsDefaultProps
}

export default FacetedSearchContainer
