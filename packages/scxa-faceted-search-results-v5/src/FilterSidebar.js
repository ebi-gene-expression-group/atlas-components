import React from 'react'
import PropTypes from 'prop-types'
import CheckboxFacetGroup from './facetgroups/CheckboxFacetGroup'
import { withFetchLoader } from '@ebi-gene-expression-group/atlas-react-fetch-loader'
import MultiselectDropdownFacetGroup from './facetgroups/MultiselectDropdownFacetGroup'

const CheckboxFacetGroupWithFetchLoader = withFetchLoader(CheckboxFacetGroup)
const MultiselectDropdownFacetGroupWithFetchLoader = withFetchLoader(MultiselectDropdownFacetGroup)

const initCheckboxFacetGroups = (checkboxFacetGroups, changedFacetGroup, facetsOfChangedGroup) => {
  const checkboxGroupsToRender = checkboxFacetGroups
    .map(facetGroup => ({ ...facetGroup, refreshGroup: true }))

  checkboxGroupsToRender
    .filter(facetGroup => facetGroup.queryParamName === changedFacetGroup)
    .forEach(facetGroup => {
      facetGroup.facets = facetsOfChangedGroup
      facetGroup.refreshGroup = false
    })

  return checkboxGroupsToRender
}

const initMultiSelectDropdownFacetGroups =
  (multiSelectDropdownFacetGroups, changedFacetGroup, facetsOfChangedGroup) => {
    const dropdownGroupsToRender = multiSelectDropdownFacetGroups
      .map(facetGroup => ({ ...facetGroup, refreshGroup: true }))

    dropdownGroupsToRender
      .filter(facetGroup => facetGroup.queryParamName === changedFacetGroup)
      .forEach(facetGroup => {
        facetGroup.facets = facetsOfChangedGroup
        facetGroup.refreshGroup = false
      })

    return dropdownGroupsToRender
  }

const getQueryParamsByFacetGroupsAsString = (queryParams, facetGroupName) => {
  return queryParams[facetGroupName] === undefined ? [] : queryParams[facetGroupName]
}

const FilterSidebar = ({
  host, onChange, queryParams, checkboxFacetGroups, multiSelectDropdownFacetGroups,
  changedFacetGroup, facetsOfChangedGroup
}) => (
  [
    initCheckboxFacetGroups(checkboxFacetGroups, changedFacetGroup, facetsOfChangedGroup)
      .map((facetGroup) => (
        facetGroup.refreshGroup === true ?
          <CheckboxFacetGroupWithFetchLoader
            key={facetGroup.name}
            host={host}
            resource={facetGroup.endpoint}
            query={queryParams}
            queryParams={getQueryParamsByFacetGroupsAsString(queryParams, facetGroup.queryParamName)}
            fulfilledPayloadProvider={facetGroup.payloadConversion}
            name={facetGroup.name}
            description={facetGroup.description}
            onChange={onChange}/> :
          <CheckboxFacetGroup
            key={facetGroup.name}
            queryParams={getQueryParamsByFacetGroupsAsString(queryParams, facetGroup.queryParamName)}
            name={facetGroup.name}
            description={facetGroup.description}
            facets={facetGroup.facets}
            onChange={onChange}/>
      )),
    initMultiSelectDropdownFacetGroups(multiSelectDropdownFacetGroups, changedFacetGroup, facetsOfChangedGroup)
      .map((facetGroup) => (
        facetGroup.refreshGroup === true ?
          <MultiselectDropdownFacetGroupWithFetchLoader
            key={facetGroup.name}
            host={host}
            resource={facetGroup.endpoint}
            query={queryParams}
            queryParams={getQueryParamsByFacetGroupsAsString(queryParams, facetGroup.queryParamName)}
            fulfilledPayloadProvider={facetGroup.payloadConversion}
            name={facetGroup.name}
            description={facetGroup.description}
            onChange={onChange}/> :
          <MultiselectDropdownFacetGroup
            key={facetGroup.name}
            queryParams={getQueryParamsByFacetGroupsAsString(queryParams, facetGroup.queryParamName)}
            name={facetGroup.name}
            description={facetGroup.description}
            facets={facetGroup.facets}
            onChange={onChange}/>
      ))
  ]
)

FilterSidebar.propTypes = {
  checkboxFacetGroups: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string.required,
    description: PropTypes.string.required,
    endpoint: PropTypes.string.isRequired,
    payloadConversion: PropTypes.func,
    refreshGroup: PropTypes.bool
  })
  ),
  multiSelectDropdownFacetGroups: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string.required,
    description: PropTypes.string.required,
    endpoint: PropTypes.string.isRequired,
    payloadConversion: PropTypes.func,
    refreshGroup: PropTypes.bool
  })
  ),
  host: PropTypes.string.required,
  queryParams: PropTypes.object,
  changedFacetGroup: PropTypes.string,
  facetsOfChangedGroup: PropTypes.array,
  onChange: PropTypes.func.isRequired
}

FilterSidebar.defaultProps = {
  checkboxFacetGroups: [],
  multiSelectDropdownFacetGroups: []
}

export default FilterSidebar
