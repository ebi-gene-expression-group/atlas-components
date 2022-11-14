import React from "react"

import CheckboxFacetGroup from '../../src/facetgroups/CheckboxFacetGroup'

import { getFacetTooltip, getPropsWithTooltip, getPropsWithoutTooltip } from './TestUtils'

describe(`CheckboxFacetGroup`, () => {
  it(`displays the expected tooltip if it exists`, () => {
    const facetTooltip = getFacetTooltip()
    const propsWithTooltip = getPropsWithTooltip(facetTooltip)

    cy.mount(<CheckboxFacetGroup {...propsWithTooltip}/>)
    cy.get(`div.padding-bottom-xlarge h4 sup span`)
      .should(`have.class`, `icon icon-generic`)
      .should(`have.attr`, `data-tip`)
      .and(`eq`, `<span>${facetTooltip.description}</span>`)
  })

  it(`doesn't display tooltip if not present`, () => {
    const propsWithoutTooltip = getPropsWithoutTooltip()

    cy.mount(<CheckboxFacetGroup {...propsWithoutTooltip}/>)
    cy.get(`div.padding-bottom-xlarge h4`)
      .children()
      .should(`have.length`, 0)
  })
})
