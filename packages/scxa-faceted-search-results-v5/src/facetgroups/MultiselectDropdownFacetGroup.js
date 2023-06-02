import React from 'react'
import Select from 'react-select'
import styled from 'styled-components'

import FacetGroupPropTypes from './FacetGroupPropTypes'
import TooltipIcon from './TooltipIcon'

// We replace the dropdown indicator for another component because the default chevron is a SVG element, not a
// background-image, whereas the control can be styled using the styles API packaged in React-Select

// Stolen from https://ebi.emblstatic.net/web_guidelines/EBI-Framework/v1.3/css/ebi-global.css select
const DropdownIndicator = styled.span`
  background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' version='1.1' width='32' height='24' viewBox='0 0 32 24'><polygon points='0,0 32,0 16,24' style='fill: rgb%28138, 138, 138%29'></polygon></svg>");
  background-origin: content-box;
  background-position: center;
  background-repeat: no-repeat;
  background-size: 9px 6px;
  width: 1.5rem;
  height: 1rem;
`

// Stolen from https://ebi.emblstatic.net/web_guidelines/EBI-Framework/v1.3/css/ebi-global.css select
const ebiVfSelectStyles = {
  control: (styles, state) => ({
    minHeight: `2.4375rem`,
    margin: `0 0 1rem`,
    padding: `0`,
    appearance: `none`,
    border: state.isFocused ? `1px solid #8a8a8a` : `1px solid #777`,
    borderRadius: `0`,
    backgroundColor: state.isDisabled ? `#e6e6e6` : `#fefefe`,
    fontFamily: `inherit`,
    fontSize: `1rem`,
    fontWeight: `normal`,
    lineHeight: `1.5`,
    color: `#0a0a0a`,
    transition: `box-shadow 0.5s, border-color 0.25s ease-in-out`,
    outline: state.isFocused ? `none` : `inherit`,
    boxShadow: state.isFocused ? `0 0 5px #777` : `none`,
    cursor: state.isDisabled ? `not-allowed` : `default`,
    display: `flex`
  }),
  multiValueLabel: (styles) => ({
    ...styles,
    whiteSpace: `pre-line`
  }),
  menu: (styles) => ({
    ...styles,
    borderRadius: `0`,
    padding: `0`
  })
}

const getSelectedFacets = (queryParams, allFacets) => {
  return allFacets.filter(facet => queryParams.includes(facet.label))
}

const MultiselectDropdownFacetGroup = ({name, description, facets, onChange, queryParams}) => (
  facets.length > 0 && (
    <div id={`facetGroupMultiSelectDropdown`}  className={`padding-bottom-xlarge`}>
      <h4>
        {name}
        {description && <TooltipIcon tooltipText={description}/>}
      </h4>
      <Select
        inputId={`facetGroupMultiSelectDropdown`}
        components={{DropdownIndicator, IndicatorSeparator: null}}
        styles={ebiVfSelectStyles}
        closeMenuOnSelect={false}
        defaultValue={getSelectedFacets(queryParams, facets)}
        isClearable={true}
        isMulti={true}
        onChange={(selectedFacets) => onChange(facets.map(facet => facet.group)[0], selectedFacets, facets)}
        options={facets.filter((facet) => !facet.disabled)}/>
    </div>
  )
)

MultiselectDropdownFacetGroup.propTypes = FacetGroupPropTypes

export default MultiselectDropdownFacetGroup
