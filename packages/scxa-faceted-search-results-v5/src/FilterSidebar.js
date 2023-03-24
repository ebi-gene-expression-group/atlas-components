import React from 'react'
import PropTypes from 'prop-types'
import CheckboxFacetGroup from './facetgroups/CheckboxFacetGroup'
import {withFetchLoader} from "@ebi-gene-expression-group/atlas-react-fetch-loader";

const CheckboxFacetGroupWithFetchLoader = withFetchLoader(CheckboxFacetGroup)

class FilterSidebar extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    const { checkboxFacetGroups, host, queryParams, onChange } = this.props

    return checkboxFacetGroups.map((facetGroup) =>
      <CheckboxFacetGroupWithFetchLoader
        host={host}
        resource={facetGroup.endpoint}
        query={queryParams}
        fulfilledPayloadProvider={facetGroup.payloadConversion}
        facetGroupName={facetGroup.name}
        facetGroupDescription={facetGroup.description}

        onChange={onChange}/>
    )
  }
}

FilterSidebar.propTypes = {
  checkboxFacetGroups: PropTypes.arrayOf(PropTypes.shape({
      name: PropTypes.string.required,
      description: PropTypes.string.required,
      endpoint: PropTypes.string.isRequired,
    })
  )
}

FilterSidebar.defaultProps = {
  checkboxFacetGroups: []
}

export default FilterSidebar
