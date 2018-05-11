import React from 'react'
import { xorBy } from 'lodash'

import FacetGroupPropTypes from './FacetGroupPropTypes'

const CheckboxOption = ({group, value, label, onChange, checked}) =>
  <div>
    <input type={`checkbox`} value={value} onChange={() => onChange({group, label, value})} checked={checked}/>
    <label>{label}</label>
  </div>

// In principle we don’t need this component to be stateful, but in doing so and returning a (facetGroupName, facets)
// we have the same API as React-Select and we can have the same callback for both checkbox-style facet groups and
// multiselect dropdowns
class CheckboxFacetGroup extends React.Component {
  constructor(props) {
    super(props)
    this.state = { checkedFacets: [] }
    this._handleChange = this._handleChange.bind(this)
  }

  _handleChange(facet) {
    this.setState(
      { checkedFacets: xorBy(this.state.checkedFacets, [facet], `value`) },
      () => this.props.onChange(facet.group, this.state.checkedFacets))
  }

  render() {
    const {hideName, facetGroupName, facets} = this.props
    const {checkedFacets} = this.state

    return (
      <div className={`padding-bottom-xlarge`}>
        {!hideName && <h4>{facetGroupName}</h4>}
        {facets.map((facet) => <CheckboxOption {...facet}
                                               onChange={this._handleChange}
                                               key={facet.value}
                                               checked={checkedFacets.some((checkedFacet) => checkedFacet.value === facet.value)}/>)}
      </div>
    )
  }
}

CheckboxFacetGroup.propTypes = FacetGroupPropTypes

export default CheckboxFacetGroup
