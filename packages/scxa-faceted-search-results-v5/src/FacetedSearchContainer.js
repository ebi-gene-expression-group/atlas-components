import React from 'react'
import PropTypes from 'prop-types'

import FilterSidebar from './FilterSidebar'

import CheckboxFacetGroupsDefaultProps from './facetgroups/CheckboxFacetGroupsDefaultProps'
import MultiSelectDropdownFacetGroupsDefaultProps from "./facetgroups/MultiSelectDropdownFacetGroupsDefaultProps";
import {withFetchLoader} from "@ebi-gene-expression-group/atlas-react-fetch-loader";
import FilterList from "./FilterList";

const FilterListWithFetchLoader = withFetchLoader(FilterList)

class FacetedSearchContainer extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      queryParams: this.convertQueryStringToObject(props.queryParams)
    }
    this.onChange = this.onChange.bind(this)
  }

  convertQueryStringToObject(queryString) {
    return Object.fromEntries(new URLSearchParams(queryString))
  }

  convertQueryStringFromObject(queryStringObject) {
    return new URLSearchParams(queryStringObject).toString()
  }

  onChange(termName, changedFacet) {
    const value = changedFacet.label
    let queryStringObject = this.state.queryParams

    if (value !== undefined) {
      const type = changedFacet.value
      const termType = type === `isMarkerGenes` ? `true` : value
      let currentTermStr = queryStringObject[type]

      if (typeof currentTermStr !== `undefined`) {
        let currentTerms = currentTermStr.split(`,`)
        if (currentTerms.indexOf(termType) !== -1) {
          currentTerms.splice(currentTerms.indexOf(termType), 1)
        } else {
          currentTerms.push(termType)
        }
        currentTermStr = currentTerms.length === 0 ? `` : currentTerms.join(`,`)
      } else {
        currentTermStr = termType
      }

      if (currentTermStr === ``) {
        delete queryStringObject[type]
      } else {
        queryStringObject[type] = currentTermStr
      }
    }

    this.setState({
      queryParams: queryStringObject
    })
  }

  render() {
    const { checkboxFacetGroups, multiSelectDropdownFacetGroups, host, filterListEndpoint,
      ResultsHeaderClass, ResultElementClass,
      sortTitle } = this.props
    const queryParams = this.state.queryParams

    return(
      <div className={`row expanded`}>
        <div className={`small-12 medium-4 large-3 columns`}>
          <FilterSidebar onChange={this.onChange}
                         {...{checkboxFacetGroups, multiSelectDropdownFacetGroups, host, queryParams}}/>
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
            {...{ResultElementClass, ResultsHeaderClass, sortTitle}}
          />
        </div>
      </div>
    )
  }
}

FacetedSearchContainer.propTypes = {
  host: PropTypes.string.isRequired,
  checkboxFacetGroups: PropTypes.arrayOf(PropTypes.shape({
      name: PropTypes.string.required,
      description: PropTypes.string.required,
      endpoint: PropTypes.string.isRequired,
      payloadConversion: PropTypes.func
    })
  ),
  multiSelectDropdownFacetGroups: PropTypes.arrayOf(PropTypes.shape({
      name: PropTypes.string.required,
      description: PropTypes.string.required,
      endpoint: PropTypes.string.isRequired,
      payloadConversion: PropTypes.func
    })
  ),
  queryParams: PropTypes.string,
  filterListEndpoint: PropTypes.string.isRequired,
}

FacetedSearchContainer.defaultProps = {
  checkboxFacetGroups: CheckboxFacetGroupsDefaultProps,
  multiSelectDropdownFacetGroups: MultiSelectDropdownFacetGroupsDefaultProps
}

export default FacetedSearchContainer
