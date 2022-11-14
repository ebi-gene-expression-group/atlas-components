import React from "react"

import MultiselectDropdownFacetGroup from '../../src/facetgroups/MultiselectDropdownFacetGroup'

import {getFacetTooltip, getPropsWithoutTooltip, getPropsWithTooltip} from "./TestUtils";

describe(`MultiselectDropdownFacetGroup`, () => {

  let propsWithTooltip = {}
  let propsWithoutTooltip = {}
  let facetTooltip

  beforeEach(() => {
    facetTooltip = getFacetTooltip()
    propsWithTooltip = getPropsWithTooltip(facetTooltip)
    propsWithoutTooltip = getPropsWithoutTooltip()
  })

  it(`displays the expected tooltip if it exists`, () => {
    cy.mount(<MultiselectDropdownFacetGroup {...propsWithTooltip}/>)
    cy.get(`div.padding-bottom-xlarge h4 sup span`)
      .should(`have.class`, `icon icon-generic`)
      .should(`have.attr`, `data-tip`)
      .and(`eq`, `<span>${facetTooltip.description}</span>`)
  })

  it(`doesn’t display tooltip if not present`, () => {
    cy.mount(<MultiselectDropdownFacetGroup {...propsWithoutTooltip}/>)
    cy.get(`div.padding-bottom-xlarge h4`)
      .children()
      .should(`have.length`, 0)
  })
})
