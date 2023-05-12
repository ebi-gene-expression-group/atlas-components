import React from 'react'
import PropTypes from 'prop-types'

import TooltipIcon from './TooltipIcon'
import FacetGroupPropTypes from "./FacetGroupPropTypes";

const CheckboxOption = ({value, label, disabled, checked, onChange}) =>
  <div>
    <input type={`checkbox`} {...{value, checked, disabled}}
           onChange={() => onChange({label, value, disabled})}/>
    <label style={disabled ? {color: `lightgrey`} : {}}>{label}</label>
  </div>

CheckboxOption.propTypes = {
  value: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  disabled: PropTypes.bool.isRequired,
  checked: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired
}

// In principle we don’t need this component to be stateful, but in doing so we can create a custom _handleChange
// function that will ultimately call onChange(facetGroupName, facets); this allows us to have the same API as
// React-Select and reuse the same callback for both checkbox-style and multiselect facet groups
class CheckboxFacetGroup extends React.Component {


  render() {
    const { name, description, facets, queryParams } = this.props
    const checkedFacets = queryParams === undefined ? [] : queryParams.split(`,`)

    return (facets.length > 0 && (<div id={`facetGroupCheckBox`} className={`padding-bottom-xlarge`}>
        <h4>
          {name}
          {description && <TooltipIcon tooltipText={description}/>}
        </h4>
        {facets.map((facet) =>
          <CheckboxOption {...facet}
                          checked={checkedFacets.some((checkedFacet) => checkedFacet.value === facet.value)}
                          onChange={(changedFacet) => this.props.onChange(name, changedFacet)}
                          key={facet.label}
          />
        )}
      </div>
    ))

  }
}

CheckboxFacetGroup.propTypes = FacetGroupPropTypes

export default CheckboxFacetGroup
