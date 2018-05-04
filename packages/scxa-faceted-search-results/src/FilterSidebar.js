import React from 'react'
import PropTypes from 'prop-types'

const FacetItem = ({label, filterAttribute, checked, onChangeHandler}) =>
  <checkbox label={label} checked={checked} onChange={() => onChangeHandler(filterAttribute, checked)} />

FacetItem.PropTypes = {
  label: PropTypes.string.isRequired,
  filterAttribute: PropTypes.string.isRequired,
  checked: PropTypes.bool.isRequired,
  onChangeHandler: PropTypes.func.isRequired
}

const FacetGroup = ({facetName, facetItems, onChangeHandler}) =>
  <div>
    <h4>{facetName}</h4>
    {facetItems.map(
      (facetItem) =>
        <FacetItem label={facetItem.label}
                   filterAttribute={facetItem.filterAttribute}
                   checked={facetItem.checked}
                   onChangeHandler={onChangeHandler}
                   key={facetItem.label} />)}
  </div>

FacetGroup.Proptypes = {
  facetName: PropTypes.string.isRequired,
  facetItems: PropTypes.arrayOf(PropTypes.shape({
    label: FacetItem.PropTypes.label,
    filterAttribute: FacetItem.PropTypes.filterAttribute,
    checked: FacetItem.PropTypes.checked,
  })).isRequired,
  onChangeHandler: PropTypes.func.isRequired
}

const FilterSidebar = ({facetGroups, onChangeHandler}) =>
  facetGroups.map((facetGroup) =>
    <FacetGroup {...facetGroup} onChangeHandler={onChangeHandler} key={facetGroup.facetName} />)

FilterSidebar.PropTypes = {
  facetGroups: PropTypes.arrayOf(PropTypes.shape({
    facetName: FacetGroup.PropTypes.facetName,
    facetItems: FacetGroup.PropTypes.facetItems,
  })).isRequired,
  onChangeHandler: PropTypes.func.isRequired
}

export default FilterSidebar
