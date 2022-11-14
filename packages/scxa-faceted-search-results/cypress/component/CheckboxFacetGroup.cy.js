
import React from "react"

import CheckboxFacetGroup from '../../src/facetgroups/CheckboxFacetGroup'

import episodes from '../fixtures/episodes.json'

describe('CheckboxFacetGroup', () => {

  let propsWithTooltip = {}
  let propsWithoutTooltip = {}
  let facetTooltip
  let facetWithoutTooltip

  beforeEach(() => {
    const allFacets = episodes.reduce((acc, episode) => acc.concat(episode.facets), [])
    const uniqueFacets =
      allFacets
        .filter((facet, index) => allFacets.findIndex((thatFacet) => facet.value === thatFacet.value) === index)
        .map((facet) => ({
          ...facet,
          disabled: false
        }))

    facetTooltip = _.shuffle(uniqueFacets).find(facet => facet.description)
    facetWithoutTooltip = _.shuffle(uniqueFacets).find(facet => !facet.description)

    propsWithTooltip = {
      facetGroupName: facetTooltip.group,
      facetGroupNameDescription: facetTooltip.description,
      facets: uniqueFacets.filter(facet => facet.group === facetTooltip.group),
      onChange: () => {}
    }

    propsWithoutTooltip = {
      facetGroupName: facetWithoutTooltip.group,
      facets: uniqueFacets.filter(facet => facet.group === facetWithoutTooltip.group),
      onChange: () => {}
    }
  })

  it('displays the expected tooltip if it exists', () => {
    cy.mount(<CheckboxFacetGroup {...propsWithTooltip}/>)
    cy.get(`div.padding-bottom-xlarge h4 sup span`)
      .should(`have.class`, `icon icon-generic`)
      .should(`have.attr`, `data-tip`)
      .and(`eq`, `<span>${facetTooltip.description}</span>`)
  })

  it('doesn’t display tooltip if not present', () => {
    cy.mount(<CheckboxFacetGroup {...propsWithoutTooltip}/>)
    cy.get(`div.padding-bottom-xlarge h4`)
      .children()
      .should('have.length', 0)
  })
})
