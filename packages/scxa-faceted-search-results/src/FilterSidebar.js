import React from 'react'
import PropTypes from 'prop-types'

import FacetGroupPropTypes from './facetgroups/FacetGroupPropTypes'
import CheckboxFacetGroup from './facetgroups/CheckboxFacetGroup'
import MultiselectDropdownFacetGroup from './facetgroups/MultiselectDropdownFacetGroup'

// Facets as checkboxes go first by design
const FilterSidebar = ({hideGroupNames, asCheckboxes, facetGroups, onChange}) =>
[
  facetGroups
    .filter((facetGroup) => asCheckboxes.includes(facetGroup.facetName))
    .map((facetGroup) => <CheckboxFacetGroup {...facetGroup}
                                             hideName={hideGroupNames.includes(facetGroup.facetName)}
                                             onChange={onChange}
                                             key={facetGroup.facetName} />),
  facetGroups
    .filter((facetGroup) => !asCheckboxes.includes(facetGroup.facetName))
    .map((facetGroup) => <MultiselectDropdownFacetGroup {...facetGroup}
                                                        hideName={hideGroupNames.includes(facetGroup.facetName)}
                                                        onChange={onChange}
                                                        key={facetGroup.facetName} />)
]

FilterSidebar.propTypes = {
  hideGroupNames: PropTypes.arrayOf(PropTypes.string),
  asCheckboxes: PropTypes.arrayOf(PropTypes.string),
  facetGroups: PropTypes.arrayOf(PropTypes.shape({
    facetName: FacetGroupPropTypes.facetName,
    facetItems: FacetGroupPropTypes.facetItems,
  })).isRequired,
  onChange: PropTypes.func.isRequired
}

FilterSidebar.defaultProps = {
  hideGroupNames: [],
  asCheckboxes: []
}

export default FilterSidebar
