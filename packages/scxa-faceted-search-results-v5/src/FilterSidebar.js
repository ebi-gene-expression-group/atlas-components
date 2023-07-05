import React from 'react'
import PropTypes from 'prop-types'
import CheckboxFacetGroup from './facetgroups/CheckboxFacetGroup'
import { withFetchLoader } from '@ebi-gene-expression-group/atlas-react-fetch-loader'
import MultiselectDropdownFacetGroup from './facetgroups/MultiselectDropdownFacetGroup'

const CheckboxFacetGroupWithFetchLoader = withFetchLoader(CheckboxFacetGroup)
const MultiselectDropdownFacetGroupWithFetchLoader = withFetchLoader(MultiselectDropdownFacetGroup)

class FilterSidebar extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      queryParams: props.queryParams,
      changedFacetGroup: props.changedFacetGroup
    }
  }

  getQueryParamsByFacetGroupsAsString(queryParams, facetGroupName) {
    return queryParams[facetGroupName] === undefined ? [] : queryParams[facetGroupName]
  }

  initialiseFacetGroups(checkboxFacetGroups, multiSelectDropdownFacetGroups, changedFacetGroup, facetsOfChangedGroup) {
    checkboxFacetGroups = checkboxFacetGroups
      .map(facetGroup => ({ ...facetGroup, refreshGroup: true }))

    checkboxFacetGroups
      .filter(facetGroup => facetGroup.queryParamName === changedFacetGroup)
      .map(facetGroup => {
        facetGroup.facets = facetsOfChangedGroup
        facetGroup.refreshGroup = false
      })

    multiSelectDropdownFacetGroups = multiSelectDropdownFacetGroups
      .map(facetGroup => ({ ...facetGroup, refreshGroup: true }))

    multiSelectDropdownFacetGroups
      .filter(facetGroup => facetGroup.queryParamName === changedFacetGroup)
      .map(facetGroup => {
        facetGroup.facets = facetsOfChangedGroup
        facetGroup.refreshGroup = false
      })

    return {
      checkboxFacetGroups,
      multiSelectDropdownFacetGroups
    }
  }

  render() {
    const { host, onChange } = this.props
    const queryParams = this.state.queryParams
    const { checkboxFacetGroups, multiSelectDropdownFacetGroups } =
      this.initialiseFacetGroups(this.props.checkboxFacetGroups, this.props.multiSelectDropdownFacetGroups,
        this.props.changedFacetGroup, this.props.facetsOfChangedGroup)

    return (
      [
        checkboxFacetGroups.map((facetGroup) =>
          (
            facetGroup.refreshGroup === true ?
              <CheckboxFacetGroupWithFetchLoader
                key={facetGroup.name}
                host={host}
                resource={facetGroup.endpoint}
                query={queryParams}
                queryParams={this.getQueryParamsByFacetGroupsAsString(this.props.queryParams, facetGroup.queryParamName)}
                fulfilledPayloadProvider={facetGroup.payloadConversion}
                name={facetGroup.name}
                description={facetGroup.description}
                onChange={onChange}/> :
              <CheckboxFacetGroup
                key={facetGroup.name}
                queryParams={this.getQueryParamsByFacetGroupsAsString(this.props.queryParams, facetGroup.queryParamName)}
                name={facetGroup.name}
                description={facetGroup.description}
                facets={facetGroup.facets}
                onChange={onChange}/>
          )
        ),
        multiSelectDropdownFacetGroups.map((facetGroup) =>
          (
            facetGroup.refreshGroup === true ?
              <MultiselectDropdownFacetGroupWithFetchLoader
                key={facetGroup.name}
                host={host}
                resource={facetGroup.endpoint}
                query={queryParams}
                queryParams={this.getQueryParamsByFacetGroupsAsString(this.props.queryParams, facetGroup.queryParamName)}
                fulfilledPayloadProvider={facetGroup.payloadConversion}
                name={facetGroup.name}
                description={facetGroup.description}
                onChange={onChange}/> :
              <MultiselectDropdownFacetGroup
                key={facetGroup.name}
                queryParams={this.getQueryParamsByFacetGroupsAsString(this.props.queryParams, facetGroup.queryParamName)}
                name={facetGroup.name}
                description={facetGroup.description}
                facets={facetGroup.facets}
                onChange={onChange}/>
          )
        )
      ]
    )
  }
}

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
