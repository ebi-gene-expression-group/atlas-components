import facets from '../fixtures/vindicatorsResponse.json'
import organismParts from '../fixtures/organismPartsResponse.json'
import cellTypes from '../fixtures/cellTypesResponse.json'
import species from '../fixtures/speciesResponse.json'

import PropTypes from "prop-types";
import styled from "styled-components";
import React from "react";
import CheckboxFacetGroupsDefaultProps from "../../src/facetgroups/CheckboxFacetGroupsDefaultProps";
import MultiSelectDropdownFacetGroupsDefaultProps
  from "../../src/facetgroups/MultiSelectDropdownFacetGroupsDefaultProps";

const getPropsForCheckBoxGroupWithTooltip = () => {
  return Cypress._.shuffle(CheckboxFacetGroupsDefaultProps).pop()
}

const getPropsForMultiSelectDropdownGroupWithTooltip = () => {
  return Cypress._.shuffle(MultiSelectDropdownFacetGroupsDefaultProps).pop()
}

const getPropsForMarkerGeneFacet = () => {
  const markerGeneName = `Marker genes`;
  return CheckboxFacetGroupsDefaultProps.find(facet => facet.name === markerGeneName)
}

const getPropsWithoutTooltip = () => {
  let props = getPropsForCheckBoxGroupWithTooltip()
  props.description = ``
  return props
}

const getFacets = () => {
  return Cypress._.shuffle(facets).filter(() => Math.random() > 0.5)
}

const getRandomSpecies = () => {
  return Cypress._.shuffle(species).filter(() => Math.random() > 0.5)
}

const getRandomOrganismParts = () => {
  return Cypress._.shuffle(organismParts).filter(() => Math.random() > 0.5)
}

const getRandomCellTypes = () => {
  return Cypress._.shuffle(cellTypes).filter(() => Math.random() > 0.5)
}

const ExperimentTableCard = ({title}) =>
  <div>
    <p>{title}</p>
  </div>

ExperimentTableCard.propTypes = {
  title: PropTypes.string.isRequired
}

const IconDiv = styled.div`
  width: 15%;
  text-align: center;
`
IconDiv.displayName = 'IconDiv'

const BitDiv = styled.div`
  width: 25%;
  text-align: center;
`
const DoveDiv = styled.div`
  width: 25%;
  text-align: center;
`

const ExperimentTableHeader = ({onClick}) =>
  <DoveDiv>
    <IconDiv onClick={()=>onClick(`test`)}>
      Meow
    </IconDiv>
    <BitDiv onClick={()=>onClick(`test`)}>
      Wow wow
    </BitDiv>
  </DoveDiv>

ExperimentTableHeader.propTypes = {
  onClick: PropTypes.func.isRequired
}

// Stolen from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
const getRandomInt = (min, max) => {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min)) + min //The maximum is exclusive and the minimum is inclusive
}

export { getRandomInt, getFacets, getRandomOrganismParts, getRandomCellTypes, getRandomSpecies,
  getPropsForCheckBoxGroupWithTooltip, getPropsForMultiSelectDropdownGroupWithTooltip,
  getPropsWithoutTooltip, getPropsForMarkerGeneFacet,
  ExperimentTableCard, ExperimentTableHeader }
