import React from "react"

import MultiselectDropdownFacetGroup from '../../src/facetgroups/MultiselectDropdownFacetGroup'

import {getFacetTooltip, getPropsWithoutTooltip, getPropsWithTooltip} from "./TestUtils";

describe(`MultiselectDropdownFacetGroup`, () => {
  it(`displays the expected tooltip if it exists`, () => {
    const facetTooltip = getFacetTooltip()
    const propsWithTooltip = getPropsWithTooltip(facetTooltip)

    cy.mount(<MultiselectDropdownFacetGroup {...propsWithTooltip}/>)
    cy.get(`div.padding-bottom-xlarge h4 sup span`)
      .should(`have.class`, `icon icon-generic`)
      .should(`have.attr`, `data-tip`)
      .and(`eq`, `<span>${facetTooltip.description}</span>`)
  })

  it(`doesn’t display tooltip if not present`, () => {
    const propsWithoutTooltip = getPropsWithoutTooltip()

    cy.mount(<MultiselectDropdownFacetGroup {...propsWithoutTooltip}/>)
    cy.get(`div.padding-bottom-xlarge h4`)
      .children()
      .should(`have.length`, 0)
  })
})
