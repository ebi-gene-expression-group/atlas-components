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
  }

  render() {
    const { checkboxFacetGroups, multiSelectDropdownFacetGroups, host, queryParams, onChange } = this.props

    return(
      [
        checkboxFacetGroups.map((facetGroup) =>
          <CheckboxFacetGroupWithFetchLoader
            host={host}
            resource={facetGroup.endpoint}
            query={queryParams}
            fulfilledPayloadProvider={facetGroup.payloadConversion}
            facetGroupName={facetGroup.name}
            facetGroupDescription={facetGroup.description}

            onChange={onChange}/>
        ),
        multiSelectDropdownFacetGroups.map((facetGroup) =>
          <MultiselectDropdownFacetGroupWithFetchLoader
            host={host}
            resource={facetGroup.endpoint}
            query={queryParams}
            fulfilledPayloadProvider={facetGroup.payloadConversion}
            facetGroupName={facetGroup.name}
            facetGroupDescription={facetGroup.description}

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
}

FilterSidebar.defaultProps = {
  checkboxFacetGroups: [],
  multiSelectDropdownFacetGroups: []
}

export default FilterSidebar
