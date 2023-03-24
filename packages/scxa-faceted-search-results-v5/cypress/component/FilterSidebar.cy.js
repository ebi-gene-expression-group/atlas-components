import React from "react"

import FilterSidebar from "../../src/FilterSidebar"

import CheckboxFacetGroupsDefaultProps from "../../src/facetgroups/CheckboxFacetGroupsDefaultProps";

let propsForFilterSideBar = {
  host: `/gxa/sc/`,
  query: `q=aGeneId`,
}

describe('FilterSidebar', () => {

  it(`should load "is marker genes" facet group when there is at least 1 marker gene`, () => {
    const markerGenePayload = `true`
    const speciesPayload = []
    cy.intercept(`GET`, `/gxa/sc/json/gene-search/marker-genes`, markerGenePayload)
    cy.intercept(`GET`, `/gxa/sc/json/gene-search/species`, speciesPayload)

    propsForFilterSideBar.checkboxFacetGroups = CheckboxFacetGroupsDefaultProps

    cy.mount(<FilterSidebar {...propsForFilterSideBar} />)

    cy.get(`input[type="checkbox"]`).should((inputs) => {
      expect(inputs.length).to.equal(1)
    })
  })

  it(`should loads "species" facet group when there are couple of species exists for the given term`, () => {
    const markerGenePayload = `false`
    const speciesPayload = [
      `Arabidopsis_thaliana`,
      `Callithrix jacchus`,
      `Danio rerio`,
      `Gallus gallus`,
      `Homo sapiens`,
      `Mus musculus`,
    ]

    cy.intercept(`GET`, `/gxa/sc/json/gene-search/marker-genes`, markerGenePayload)
    cy.intercept(`GET`, `/gxa/sc/json/gene-search/species`, speciesPayload)

    propsForFilterSideBar.checkboxFacetGroups = CheckboxFacetGroupsDefaultProps

    cy.mount(<FilterSidebar {...propsForFilterSideBar} />)

    cy.get(`input[type="checkbox"]`).should((inputs) => {
      expect(inputs.length).to.equal(speciesPayload.length)
    })
  })

  it(`should loads "species" and "is marker genes" facet groups when there are couple of species exists for the given term`, () => {
    const markerGenePayload = `true`
    const speciesPayload = [
      `Arabidopsis_thaliana`,
      `Callithrix jacchus`,
      `Danio rerio`,
      `Gallus gallus`,
      `Homo sapiens`,
      `Mus musculus`,
    ]
    const nbOfIsMarkerGeneCheckboxes = 1
    const expectedNbOfCheckboxes = speciesPayload.length + nbOfIsMarkerGeneCheckboxes

    cy.intercept(`GET`, `/gxa/sc/json/gene-search/marker-genes`, markerGenePayload)
    cy.intercept(`GET`, `/gxa/sc/json/gene-search/species`, speciesPayload)

    propsForFilterSideBar.checkboxFacetGroups = CheckboxFacetGroupsDefaultProps

    cy.mount(<FilterSidebar {...propsForFilterSideBar} />)

    cy.get(`input[type="checkbox"]`).should((inputs) => {
      expect(inputs.length).to.equal(expectedNbOfCheckboxes)
    })
  })


  it(`should hide checkbox group if result does not contains any related element`, () => {
    const markerGenePayload = `false`
    const speciesPayload = []
    cy.intercept(`GET`, `/gxa/sc/json/gene-search/marker-genes`, markerGenePayload)
    cy.intercept(`GET`, `/gxa/sc/json/gene-search/species`, speciesPayload)

    propsForFilterSideBar.checkboxFacetGroups = CheckboxFacetGroupsDefaultProps

    cy.mount(<FilterSidebar {...propsForFilterSideBar} />)

    cy.get(`input[type="checkbox"]`).should(`not.exist`)
  })
})
