import React from "react"

import MultiselectDropdownFacetGroup from '../../src/facetgroups/MultiselectDropdownFacetGroup'

import {
  getFacets,
  getPropsWithoutTooltip,
  getPropsForMultiSelectDropdownGroupWithTooltip,
  getRandomInt
} from "./TestUtils"

import vindicators from "../fixtures/vindicatorsResponse.json"

describe(`MultiselectDropdownFacetGroup`, () => {
  it(`displays the expected tooltip if it exists`, () => {
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

  it(`callback includes user typed facet name in arguments`, () => {
    const props = {
      name: `Vindicators`,
      description: `Show the vindicators`,
      facets: vindicators,
      queryParams: []
    }

    const mockCallbackWrapper = {
      onChange: function (facetGroup, checkedFacets) {
      }
    }
    cy.spy(mockCallbackWrapper, `onChange`).as(`onChange`)
    const randomIndex = getRandomInt(0, props.facets.length)
    const valueToType = vindicators[randomIndex].value

    cy.mount(<MultiselectDropdownFacetGroup {...props} onChange={mockCallbackWrapper.onChange} />)
    cy.findAllByTestId(`facetGroupMultiSelectDropdown`)
      .get(`div[class$='ValueContainer']`)
      .first()
      .get(`input`)
      .type(`${valueToType}{enter}`, { force: true })

    cy.get(`@onChange`)
      .should(`have.been.calledOnceWithExactly`,
        props.name, [props.facets[randomIndex]], props.facets
      )
  })
})
