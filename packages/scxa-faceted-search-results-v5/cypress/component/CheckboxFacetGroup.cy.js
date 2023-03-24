import React from "react"

import CheckboxFacetGroup from '../../src/facetgroups/CheckboxFacetGroup'

import { getFacets, getPropsWithTooltip, getPropsWithoutTooltip } from './TestUtils'

describe(`CheckboxFacetGroup`, () => {
  it(`displays the expected tooltip if it exists`, () => {
    const propsWithTooltip = getPropsWithTooltip()
    const facetTooltip = propsWithTooltip.description
    const props = {
      ...propsWithTooltip,
      facets: getFacets()
    }

    cy.mount(<CheckboxFacetGroup {...props }/>)
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

  it(`doesn't display tooltip if not present`, () => {
    const propsWithoutTooltip = {
      ...getPropsWithoutTooltip(),
      facets: getFacets()
    }
    cy.mount(<CheckboxFacetGroup {...propsWithoutTooltip}/>)
    cy.get(`div.padding-bottom-xlarge h4`)
      .children()
      .should(`have.length`, 0)
  })
})
