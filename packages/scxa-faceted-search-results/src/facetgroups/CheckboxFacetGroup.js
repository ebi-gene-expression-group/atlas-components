import React from 'react'

import FacetGroupPropTypes from './FacetGroupPropTypes'

const CheckboxOption = ({value, label, onChange, checked}) =>
  <div>
    <input type={`checkbox`} value={value} onChange={() => onChange({label, value})} checked={checked}/>
    <label>{label}</label>
  </div>

// In principle we don’t need this component to be stateful, but in doing so and returning a (facetName, checkedItems)
// we have the same API as React-Select and we need only the same callback for both checkbox-style facet groups and
// multiselect dropdown ones
class CheckboxFacetGroup extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      checkedItems: []
    }

    this._handleChange = this._handleChange.bind(this)
  }

  _handleChange(facetName, facetItem) {
    const checkedItems = this.state.checkedItems.some((checkedItem) => checkedItem.value === facetItem.value) ?
      this.state.checkedItems.filter((checkedItem) => checkedItem.value !== facetItem.value) :
      this.state.checkedItems.concat(facetItem)

    this.setState({
      checkedItems: checkedItems
    })

    this.props.onChange(facetName, checkedItems)
  }

  render() {
    const {hideName, facetName, facetItems} = this.props

    return (
      <div className={`padding-bottom-xlarge`}>
        {!hideName && <h4>{facetName}</h4>}
        {facetItems.map((facetItem) => <CheckboxOption {...facetItem}
                                                       onChange={(args) => this._handleChange(facetName, args)}
                                                       key={facetItem.value}
                                                       checked={this.state.checkedItems.some((checkedItem) => checkedItem.value === facetItem.value)}/>)}
      </div>
    )
  }
}

// If we pass two callbacks, one for MultiselectDropdownFacetGroup and another for CheckboxFacetGroup (see comment
//above), we could have something as simple as this:
// const CheckboxFacetGroup = ({hideName, facetName, facetItems, onChangeHandler}) =>
//   <div className={`padding-bottom-xlarge`}>
//     {!hideName && <h4>{facetName}</h4>}
//     {facetItems.map((facetItem) => <CheckboxOption {...facetItem}
//                                                    onChangeHandler={(args) => onChangeHandler(facetName, args)}
//                                                    key={facetItem.value}/>)}
//   </div>

CheckboxFacetGroup.propTypes = FacetGroupPropTypes

export default CheckboxFacetGroup
