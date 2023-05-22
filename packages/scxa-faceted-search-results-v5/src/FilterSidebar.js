import React from 'react'
import PropTypes from 'prop-types'
import CheckboxFacetGroup from './facetgroups/CheckboxFacetGroup'
import {withFetchLoader} from "@ebi-gene-expression-group/atlas-react-fetch-loader";
import MultiselectDropdownFacetGroup from "./facetgroups/MultiselectDropdownFacetGroup";

const CheckboxFacetGroupWithFetchLoader = withFetchLoader(CheckboxFacetGroup)
const MultiselectDropdownFacetGroupWithFetchLoader = withFetchLoader(MultiselectDropdownFacetGroup)

class FilterSidebar extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      queryParams: props.queryParams
    }
  }

  render() {
    const { checkboxFacetGroups, multiSelectDropdownFacetGroups, host, onChange } = this.props
    const queryParamsObject = this.state.queryParams

    return(
      [
        checkboxFacetGroups.map((facetGroup) =>
          <CheckboxFacetGroupWithFetchLoader
            key={facetGroup.name}
            host={host}
            resource={facetGroup.endpoint}
            query={queryParamsObject}
            queryParams={
              this.props.queryParams[facetGroup.queryParamName] === undefined ?
                [] : this.props.queryParams[facetGroup.queryParamName].split(`,`)
            }
            fulfilledPayloadProvider={facetGroup.payloadConversion}
            name={facetGroup.name}
            description={facetGroup.description}
            onChange={onChange}/>
        ),
        multiSelectDropdownFacetGroups.map((facetGroup) =>
          <MultiselectDropdownFacetGroupWithFetchLoader
            key={facetGroup.name}
            host={host}
            resource={facetGroup.endpoint}
            query={queryParamsObject}
            queryParams={
              this.props.queryParams[facetGroup.queryParamName] === undefined ?
                [] : this.props.queryParams[facetGroup.queryParamName].split(`,`)
            }
            fulfilledPayloadProvider={facetGroup.payloadConversion}
            name={facetGroup.name}
            description={facetGroup.description}
            onChange={onChange}/>
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
    })
  ),
  multiSelectDropdownFacetGroups: PropTypes.arrayOf(PropTypes.shape({
      name: PropTypes.string.required,
      description: PropTypes.string.required,
      endpoint: PropTypes.string.isRequired,
      payloadConversion: PropTypes.func,
    })
  ),
  host: PropTypes.string.required,
  queryParams: PropTypes.object,
  onChange: PropTypes.func.isRequired,
}

FilterSidebar.defaultProps = {
  checkboxFacetGroups: [],
  multiSelectDropdownFacetGroups: []
}

export default FilterSidebar
