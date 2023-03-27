import React from 'react'
import PropTypes from 'prop-types'

import FilterSidebar from './FilterSidebar'

import CheckboxFacetGroupsDefaultProps from './facetgroups/CheckboxFacetGroupsDefaultProps'
import MultiSelectDropdownFacetGroupsDefaultProps from "./facetgroups/MultiSelectDropdownFacetGroupsDefaultProps";

class FacetedSearchContainer extends React.Component {

  render() {
    const { checkboxFacetGroups, multiSelectDropdownFacetGroups, host, queryParams, onChange } = this.props

    return(
      <div className={`row expanded`}>
        <div className={`small-12 medium-4 large-3 columns`}>
          <FilterSidebar {...{checkboxFacetGroups, multiSelectDropdownFacetGroups, host, queryParams, onChange}}/>
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
  onChange: PropTypes.func.isRequired,
}

FacetedSearchContainer.defaultProps = {
  checkboxFacetGroups: CheckboxFacetGroupsDefaultProps,
  multiSelectDropdownFacetGroups: MultiSelectDropdownFacetGroupsDefaultProps
}

export default FacetedSearchContainer
