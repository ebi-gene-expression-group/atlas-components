import React from "react"

import MultiselectDropdownFacetGroup from '../../src/facetgroups/MultiselectDropdownFacetGroup'

import {getFacets, getPropsWithoutTooltip, getPropsForMultiSelectDropdownGroupWithTooltip} from "./TestUtils";

describe(`MultiselectDropdownFacetGroup`, () => {
  it(`displays the expected tooltip if it exists`, () => {
    // const facetTooltip = getFacetTooltip()
    // const propsWithTooltip = getPropsWithTooltip(facetTooltip)

    const propsWithTooltip = getPropsForMultiSelectDropdownGroupWithTooltip()
    const facetTooltip = propsWithTooltip.description
    const props = {
      ...propsWithTooltip,
      facets: getFacets()
    }

    cy.mount(<MultiselectDropdownFacetGroup {...props}/>)
    cy.get(`div.padding-bottom-xlarge h4 sup span`)
      .should(`have.class`, `icon icon-generic`)
      .should(`have.attr`, `data-tip`).then((dataTip) => {
      expect(dataTip.toString()
        .replace(`<span>`, ``)
        .replace(`</span>`, ``)
        .replace(`<br>`, ` `))
        .to.equal(facetTooltip)
    })
  })

  it(`doesn’t display tooltip if not present`, () => {
    const propsWithoutTooltip = {
      ...getPropsWithoutTooltip(),
      facets: getFacets()
    }

    cy.mount(<MultiselectDropdownFacetGroup {...propsWithoutTooltip}/>)
    cy.get(`div.padding-bottom-xlarge h4`)
      .children()
      .should(`have.length`, 0)
  })
})
