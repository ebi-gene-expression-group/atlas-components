import React from 'react'
import PropTypes from 'prop-types'

import TooltipIcon from './TooltipIcon'
import FacetGroupPropTypes from "./FacetGroupPropTypes"

const CheckboxOption = ({ group, value, label, disabled, checked, onChange }) =>
  <div>
    <input type={`checkbox`} {...{ value, checked, disabled }}
      onChange={() => onChange({ label, group, disabled })}/>
    <label style={disabled ? { color: `lightgrey` } : {}}>{label}</label>
  </div>

CheckboxOption.propTypes = {
  group: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  disabled: PropTypes.bool.isRequired,
  checked: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired
}

const getSelectedFacets = (facets, checkedFacets, changedFacetLabel) => {
  if (checkedFacets.some(e => e === `true`)) {
    checkedFacets = facets.map(facet => facet.label)
  }

  if (checkedFacets.length === 0) {
    checkedFacets.push(changedFacetLabel)
  } else {
    if (checkedFacets.indexOf(changedFacetLabel) !== -1) {
      checkedFacets.splice(checkedFacets.indexOf(changedFacetLabel), 1)
    } else {
      checkedFacets.push(changedFacetLabel)
    }
  }

  return facets.filter(facet => checkedFacets.includes(facet.label))
}

const CheckboxFacetGroup = ({ name, description, facets, onChange, queryParams: checkedFacets }) => (
  facets.length > 0 && (<div role={`facetGroupCheckBox`} className={`padding-bottom-xlarge`}>
    <h4>
      {name}
      {description && <TooltipIcon tooltipText={description}/>}
    </h4>
    {facets.map((facet) =>
      <CheckboxOption {...facet}
        checked={checkedFacets.some((checkedFacet) => checkedFacet === `true` || checkedFacet === facet.label)}
        onChange={(changedFacet) =>
          onChange(
            changedFacet.group,
            getSelectedFacets(facets, checkedFacets, changedFacet.label),
            facets)
        }
        key={facet.label}
      />
    )}
  </div>
  )
)

CheckboxFacetGroup.propTypes = FacetGroupPropTypes

export default CheckboxFacetGroup
