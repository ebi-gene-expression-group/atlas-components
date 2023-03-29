import React from "react"

import FilterSidebar from "../../src/FilterSidebar"

import CheckboxFacetGroupsDefaultProps from "../../src/facetgroups/CheckboxFacetGroupsDefaultProps"
import MultiSelectDropdownFacetGroupsDefaultProps
  from "../../src/facetgroups/MultiSelectDropdownFacetGroupsDefaultProps"
import {getRandomOrganismParts, getRandomCellTypes, getRandomSpecies} from './TestUtils'

let propsForFilterSideBar = {
  host: `/gxa/sc/`,
  query: `q=aGeneId`,
}

const emptyPayload = []

describe('FilterSidebar', () => {

  it(`should load "is marker genes" facet group when there is at least 1 marker gene`, () => {
    const markerGenePayload = `true`
    const speciesPayload = emptyPayload
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
    const speciesPayload = getRandomSpecies()

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
    const speciesPayload = getRandomSpecies()
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
    const speciesPayload = emptyPayload
    cy.intercept(`GET`, `/gxa/sc/json/gene-search/marker-genes`, markerGenePayload)
    cy.intercept(`GET`, `/gxa/sc/json/gene-search/species`, speciesPayload)

    propsForFilterSideBar.checkboxFacetGroups = CheckboxFacetGroupsDefaultProps

    cy.mount(<FilterSidebar {...propsForFilterSideBar} />)

    cy.get(`input[type="checkbox"]`).should(`not.exist`)
  })

  it(`should load "organism part" facet group when there is at least 1 marker gene`, () => {
    const organismPartsPayload = getRandomOrganismParts()
    const cellTypePayload = emptyPayload
    cy.intercept(`GET`, `/gxa/sc/json/gene-search/organism-parts`, organismPartsPayload)
    cy.intercept(`GET`, `/gxa/sc/json/gene-search/cell-types`, cellTypePayload)

    propsForFilterSideBar.checkboxFacetGroups = []
    propsForFilterSideBar.multiSelectDropdownFacetGroups = MultiSelectDropdownFacetGroupsDefaultProps

    cy.mount(<FilterSidebar {...propsForFilterSideBar} />)

    cy.get(`input#facetGroupMultiSelectDropdown`)
      .first()
      .as(`selectedDropdown`)

    cy.get(`@selectedDropdown`)
      .click({force: true})

    cy.get(`@selectedDropdown`)
      .invoke(`attr`, `aria-controls`)
      .as(`dropdownMenuId`)

    cy.get(`@dropdownMenuId`)
      .get(`div[class$="-MenuList"]`)
      .then((labels) => {
        Object.values(labels)[0].childNodes.forEach(node => {
          expect(organismPartsPayload).to.contains(node.innerText)
        })
      })
  })

  it(`should load "cell types" facet group when there is at least 1 marker gene`, () => {
    const organismPartsPayload = emptyPayload
    const cellTypePayload = getRandomCellTypes()
    cy.intercept(`GET`, `/gxa/sc/json/gene-search/organism-parts`, organismPartsPayload)
    cy.intercept(`GET`, `/gxa/sc/json/gene-search/cell-types`, cellTypePayload)

    propsForFilterSideBar.checkboxFacetGroups = []
    propsForFilterSideBar.multiSelectDropdownFacetGroups = MultiSelectDropdownFacetGroupsDefaultProps

    cy.mount(<FilterSidebar {...propsForFilterSideBar} />)

    cy.get(`input#facetGroupMultiSelectDropdown`)
      .first()
      .as(`selectedDropdown`)

    cy.get(`@selectedDropdown`)
      .click({force: true})

    cy.get(`@selectedDropdown`)
      .invoke(`attr`, `aria-controls`)
      .as(`dropdownMenuId`)

    cy.get(`@dropdownMenuId`)
      .get(`div[class$="-MenuList"]`)
      .then((labels) => {
        Object.values(labels)[0].childNodes.forEach(node => {
          expect(cellTypePayload).to.contains(node.innerText)
        })
      })
  })

  it(`should load both "organism part" and "cell types" facet groups when there is at least 1 marker gene`, () => {
    const organismPartsPayload = getRandomOrganismParts()
    const cellTypePayload = getRandomCellTypes()
    cy.intercept(`GET`, `/gxa/sc/json/gene-search/organism-parts`, organismPartsPayload)
    cy.intercept(`GET`, `/gxa/sc/json/gene-search/cell-types`, cellTypePayload)

    propsForFilterSideBar.checkboxFacetGroups = []
    propsForFilterSideBar.multiSelectDropdownFacetGroups = MultiSelectDropdownFacetGroupsDefaultProps

    cy.mount(<FilterSidebar {...propsForFilterSideBar} />)

    cy.get(`input#facetGroupMultiSelectDropdown`)
      .first()
      .as(`cellTypeDropdown`)

    cy.get(`@cellTypeDropdown`)
      .click({force: true})

    cy.get(`@cellTypeDropdown`)
      .invoke(`attr`, `aria-controls`)
      .as(`cellTypeDropdownMenuId`)

    cy.get(`@cellTypeDropdownMenuId`)
      .get(`div[class$="-MenuList"]`)
      .then((labels) => {
        Object.values(labels)[0].childNodes.forEach(node => {
          expect(cellTypePayload).to.contains(node.innerText)
        })
      })

    cy.get(`input#facetGroupMultiSelectDropdown`)
      .last()
      .as(`organismPartDropdown`)

    cy.get(`@organismPartDropdown`)
      .click({force: true})

    cy.get(`@organismPartDropdown`)
      .invoke(`attr`, `aria-controls`)
      .as(`organismPartDropdownMenuId`)

    cy.get(`@organismPartDropdownMenuId`)
      .get(`div[class$="-MenuList"]`)
      .then((labels) => {
        Object.values(labels)[0].childNodes.forEach(node => {
          expect(organismPartsPayload).to.contains(node.innerText)
        })
      })
  })

  it(`should load both "is marker gene", "species", "organism part" and "cell types" facet groups when there is at least 1 marker gene`, () => {
    const markerGenePayload = `true`
    const speciesPayload = getRandomSpecies()
    const organismPartsPayload = getRandomOrganismParts()
    const cellTypePayload = getRandomCellTypes()

    const nbOfIsMarkerGeneCheckboxes = 1
    const expectedNbOfCheckboxes = speciesPayload.length + nbOfIsMarkerGeneCheckboxes

    cy.intercept(`GET`, `/gxa/sc/json/gene-search/marker-genes`, markerGenePayload)
    cy.intercept(`GET`, `/gxa/sc/json/gene-search/species`, speciesPayload)
    cy.intercept(`GET`, `/gxa/sc/json/gene-search/organism-parts`, organismPartsPayload)
    cy.intercept(`GET`, `/gxa/sc/json/gene-search/cell-types`, cellTypePayload)

    propsForFilterSideBar.checkboxFacetGroups = CheckboxFacetGroupsDefaultProps
    propsForFilterSideBar.multiSelectDropdownFacetGroups = MultiSelectDropdownFacetGroupsDefaultProps

    cy.mount(<FilterSidebar {...propsForFilterSideBar} />)

    cy.get(`input[type="checkbox"]`).should((inputs) => {
      expect(inputs.length).to.equal(expectedNbOfCheckboxes)
    })

    cy.get(`input#facetGroupMultiSelectDropdown`)
      .first()
      .as(`cellTypeDropdown`)

    cy.get(`@cellTypeDropdown`)
      .click({force: true})

    cy.get(`@cellTypeDropdown`)
      .invoke(`attr`, `aria-controls`)
      .as(`cellTypeDropdownMenuId`)

    cy.get(`@cellTypeDropdownMenuId`)
      .get(`div[class$="-MenuList"]`)
      .then((labels) => {
        Object.values(labels)[0].childNodes.forEach(node => {
          expect(cellTypePayload).to.contains(node.innerText)
        })
      })

    cy.get(`input#facetGroupMultiSelectDropdown`)
      .last()
      .as(`organismPartDropdown`)

    cy.get(`@organismPartDropdown`)
      .click({force: true})

    cy.get(`@organismPartDropdown`)
      .invoke(`attr`, `aria-controls`)
      .as(`organismPartDropdownMenuId`)

    cy.get(`@organismPartDropdownMenuId`)
      .get(`div[class$="-MenuList"]`)
      .then((labels) => {
        Object.values(labels)[0].childNodes.forEach(node => {
          expect(organismPartsPayload).to.contains(node.innerText)
        })
      })
  })
})
