import episodes from '../fixtures/episodes.json'
import PropTypes from "prop-types";
import styled from "styled-components";
import React from "react";

const facets = () => {
  return episodes.reduce((acc, episode) => acc.concat(episode.facets), [])
}

const getUniqueFacets = () => {
  const allFacets = facets()
  return allFacets
    .filter((facet, index) => allFacets.findIndex((thatFacet) => facet.value === thatFacet.value) === index)
    .map((facet) => ({
      ...facet,
      disabled: false
    }))
}

const getFacetTooltip = () => {
  return Cypress._.shuffle(getUniqueFacets()).find(facet => facet.description)
}

const getFacetWithoutTooltip = () => {
  return Cypress._.shuffle(getUniqueFacets()).find(facet => !facet.description)
}

const getPropsWithTooltip = (facetTooltip) => {
  return {
    facetGroupName: facetTooltip.group,
      facetGroupNameDescription: facetTooltip.description,
    facets: getUniqueFacets().filter(facet => facet.group === facetTooltip.group),
    onChange: () => {}
  }
}

const getPropsWithoutTooltip = () => {
  const facetWithoutTooltip = getFacetWithoutTooltip()
  return {
    facetGroupName: facetWithoutTooltip.group,
      facets: getUniqueFacets().filter(facet => facet.group === facetWithoutTooltip.group),
    onChange: () => {}
  }
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

export { episodes, getRandomInt, getUniqueFacets, getFacetTooltip, getPropsWithTooltip, getPropsWithoutTooltip,
  ExperimentTableCard, ExperimentTableHeader }
