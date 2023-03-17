import checkboxFacetGroups from '../fixtures/checkbox_facet_groups.json'
import checkboxes from '../fixtures/vindicators.json'
import markerGeneFacets from '../fixtures/marker_gene_facet_values.json'
import PropTypes from "prop-types";
import styled from "styled-components";
import React from "react";

const getPropsWithTooltip = () => {
  return Cypress._.shuffle(checkboxFacetGroups).pop()
}

const getPropsForMarkerGeneFacet = () => {
  const markerGeneName = `Marker genes`;
  return checkboxFacetGroups.find(facet => facet.facetGroupName === markerGeneName)
}

const getPropsWithoutTooltip = () => {
  let props = getPropsWithTooltip()
  props.facetGroupDescription = ``
  return props
}

const getFacets = () => {
  return Cypress._.shuffle(checkboxes).filter(() => Math.random() > 0.5)
}

const getMarkerGeneFacets = () => {
  return markerGeneFacets
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

export { getRandomInt, getFacets, getPropsWithTooltip, getPropsWithoutTooltip, getPropsForMarkerGeneFacet,
  getMarkerGeneFacets, ExperimentTableCard, ExperimentTableHeader }
