import React from 'react'
import PropTypes from 'prop-types'

import TooltipIcon from './TooltipIcon'
import {xorBy as _xorBy} from "lodash";

const CheckboxOption = ({value, disabled, checked, onChange}) =>
  <div>
    <input type={`checkbox`} {...{value, checked, disabled}}
           onChange={() => onChange({value, disabled})}/>
    <label style={disabled ? {color: `lightgrey`} : {}}>{value}</label>
  </div>

CheckboxOption.propTypes = {
  value: PropTypes.string.isRequired,
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

  _handleChange(facet) {
    this.setState(
      { checkedFacets: _xorBy(this.state.checkedFacets, [facet], `value`) },
      () => this.props.onChange(facet.group, this.state.checkedFacets))
  }

  render() {
    const { facetGroupName, facetGroupDescription, facets } = this.props
    const { checkedFacets } = this.state

    return (
      <div className={`padding-bottom-xlarge`}>
        <h4>
          { facetGroupName }
          { facetGroupDescription && <TooltipIcon tooltipText={facetGroupDescription}/> }
        </h4>
        {facets.map((facet) =>
          <CheckboxOption {...facet}
            checked={checkedFacets.some((checkedFacet) => checkedFacet.value === facet.value)}
            onChange={this._handleChange}
            // key={value}
          />
        )}
      </div>
    )
  }
}

CheckboxFacetGroup.propTypes = {
  facetGroupName: PropTypes.string.isRequired,
  facetGroupDescription: PropTypes.string,
  endpoint: PropTypes.string.isRequired,
  facets: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.required,
      disabled: PropTypes.bool.isRequired,
    })
  ),
  onChange: PropTypes.func.isRequired
}

export default CheckboxFacetGroup
