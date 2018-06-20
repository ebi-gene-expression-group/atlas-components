import React from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash'

import FacetGroupPropTypes from './facetgroups/FacetGroupPropTypes'
import CheckboxFacetGroup from './facetgroups/CheckboxFacetGroup'
import MultiselectDropdownFacetGroup from './facetgroups/MultiselectDropdownFacetGroup'

import {FacetPropTypes} from './ResultPropTypes'

const FilterSidebar = ({facets, checkboxFacetGroups, onChange}) => {
  const facetGroups =
    _(facets)
      .sortBy([`group`, `label`])
      .groupBy(`group`)
      .toPairs()
      .partition((facetGroup) => checkboxFacetGroups.includes(facetGroup[0]))
      .value()

  // Facets as checkboxes go first by design
  return(
    [
      facetGroups[0]
        .map((facetGroup) => <CheckboxFacetGroup facetGroupName={facetGroup[0]}
                                                 facets={facetGroup[1]}
                                                 onChange={onChange}
                                                 key={facetGroup[0]} />),
      facetGroups[1]
        .map((facetGroup) => <MultiselectDropdownFacetGroup facetGroupName={facetGroup[0]}
                                                            facets={facetGroup[1]}
                                                            onChange={onChange}
                                                            key={facetGroup[0]} />)
    ]
  )
}

FilterSidebar.propTypes = {
  facets: PropTypes.arrayOf(PropTypes.shape({
    ...FacetPropTypes,
    disabled: PropTypes.bool.isRequired})).isRequired,
  checkboxFacetGroups: PropTypes.arrayOf(PropTypes.string),
  onChange: PropTypes.func.isRequired
}

FilterSidebar.defaultProps = {
  checkboxFacetGroups: []
}

export default FilterSidebar
