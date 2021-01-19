import React from 'react'
import PropTypes from 'prop-types'
import { xorBy as _xorBy } from 'lodash'

import FacetGroupPropTypes from './FacetGroupPropTypes'
import TooltipIcon from './TooltipIcon'

const CheckboxOption = ({ group, value, label, disabled, checked, onChange }) =>
  <div>
    <input type={`checkbox`} {...{value, checked, disabled}}
      onChange={() => onChange({group, label, value, disabled})}/>
    <label style={disabled ? {color: `lightgrey`} : {}}>{label}</label>
  </div>

CheckboxOption.propTypes = {
  group: PropTypes.string.isRequired,
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
  constructor(props) {
    super(props)
    this.state = {
      checkedFacets: []
    }
    this._handleChange = this._handleChange.bind(this)
  }

  // disabled is passed in but not used (it makes tests easier)
  _handleChange(facet) {
    this.setState(
      { checkedFacets: _xorBy(this.state.checkedFacets, [facet], `value`) },
      () => this.props.onChange(facet.group, this.state.checkedFacets))
  }

  render() {
    const { facetGroupName, facetGroupNameDescription, facets } = this.props
    const { checkedFacets } = this.state

    return (
      <div className={`padding-bottom-xlarge`}>
        <h4>
          { facetGroupName }
          { facetGroupNameDescription && <TooltipIcon tooltipText={facetGroupNameDescription}/> }
        </h4>
        {facets.map((facet) =>
          <CheckboxOption {...facet}
            checked={checkedFacets.some((checkedFacet) => checkedFacet.value === facet.value)}
            onChange={this._handleChange}
            key={facet.value}/>
        )}
      </div>
    )
  }
}

CheckboxFacetGroup.propTypes = FacetGroupPropTypes

export default CheckboxFacetGroup
