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
      queryParams: props.queryParams,
    }
    this.onChange = this.onChange.bind(this)
  }

  convertQueryStringToObject(queryString) {
    return Object.fromEntries(new URLSearchParams(queryString))
  }

  convertQueryStringFromObject(queryStringObject) {
    return new URLSearchParams(queryStringObject).toString()
  }

  onChange(termName, termValues) {
    const values = [...new Set(termValues.map(value => value.label))]
    const name = [...new Set(termValues.map(value => value.value))].at(0)
    let queryStringObject = this.convertQueryStringToObject(this.state.queryParams)
    let queryParams = ""

    if (values.length > 0) {
      const termValue = values[0]

      let currentTermStr = queryStringObject[name]

      if (typeof currentTermStr !== `undefined`) {
        let currentTerms = currentTermStr.split(`,`)
        if (currentTerms.indexOf(termValue) !== -1) {
          currentTerms.splice(currentTerms.indexOf(termValue))
        } else {
          if (name === `isMarkerGenes`) {
            currentTerms.push(`true`)
          } else {
            currentTerms.push(termValue)
          }
        }
        currentTermStr = currentTerms.join(`,`)
      } else {
        if (name === `isMarkerGenes`) {
          currentTermStr = `true`
        } else {
          currentTermStr = termValue
        }
      }

      queryStringObject[name] = currentTermStr
      queryParams = this.convertQueryStringFromObject(queryStringObject)
    }

    this.setState({
      queryParams: queryParams
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
  queryParams: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.required,
      value: PropTypes.string.required,
    })
  ),
  filterListEndpoint: PropTypes.string.isRequired,
}

FacetedSearchContainer.defaultProps = {
  checkboxFacetGroups: CheckboxFacetGroupsDefaultProps,
  multiSelectDropdownFacetGroups: MultiSelectDropdownFacetGroupsDefaultProps
}

export default FacetedSearchContainer
