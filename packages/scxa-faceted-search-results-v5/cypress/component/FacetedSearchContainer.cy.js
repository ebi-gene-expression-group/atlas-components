import React from "react"

import FacetedSearchContainer from '../../src/FacetedSearchContainer'

import { ExperimentTableHeader, ExperimentTableCard,
  getRandomSpecies, getRandomOrganismParts, getRandomCellTypes } from './TestUtils'
import episodes from '../fixtures/episodesResponse.json'
import selectedEpisodes from '../fixtures/selectedEpisodesResponse.json'

describe(`FacetedSearchContainer`, () => {
  const props = {
    results: episodes,
    host: `/gxa/sc/`,
    queryParams: [],
    filterListEndpoint: `json/gene-search`,
    ResultsHeaderClass: ExperimentTableHeader,
    ResultElementClass: ExperimentTableCard
  }
  const markerGenePayload = `true`
  const speciesPayload = getRandomSpecies()
  const organismPartsPayload = getRandomOrganismParts()
  const cellTypePayload = getRandomCellTypes()
  const resultList = { results: episodes }
  const selectedResultList = { results: selectedEpisodes }
  const emptyResponse = []

  beforeEach(() => {
      cy.intercept(`GET`, `/gxa/sc/json/gene-search/marker-genes`, markerGenePayload)
      cy.intercept(`GET`, `/gxa/sc/json/gene-search/species`, speciesPayload)
      cy.intercept(`GET`, `/gxa/sc/json/gene-search/organism-parts`, organismPartsPayload)
      cy.intercept(`GET`, `/gxa/sc/json/gene-search/cell-types`, cellTypePayload)
    }
  )

  it(`when results have facets they are displayed along with the results list`, () => {
    cy.intercept(`GET`, `/gxa/sc/json/gene-search`, resultList)

    cy.mount(<FacetedSearchContainer {...props} />)
    cy.get(`input#facetGroupMultiSelectDropdown`).should(`have.length`, 2)
    cy.get(`div#facetGroupCheckBox`).should(`have.length`, 2)
    cy.get(`div#filterList`).should(`have.length`, 1)
  })

  it(`when results have no facets only the results list is displayed`, () => {
    cy.intercept(`GET`, `/gxa/sc/json/gene-search/marker-genes`, `false`)
    cy.intercept(`GET`, `/gxa/sc/json/gene-search/species`, emptyResponse)
    cy.intercept(`GET`, `/gxa/sc/json/gene-search/organism-parts`, emptyResponse)
    cy.intercept(`GET`, `/gxa/sc/json/gene-search/cell-types`, emptyResponse)
    cy.intercept(`GET`, `/gxa/sc/json/gene-search`, resultList)

    cy.mount(<FacetedSearchContainer {...props} />)
    cy.get(`input#facetGroupMultiSelectDropdown`).should(`not.exist`)
    cy.get(`div#facetGroupCheckBox`).should(`not.exist`)
    cy.get(`div#filterList`).should(`have.length`, 1)
  })

  it(`clicking to select/unselect a single facet in a group works`, () => {
    const selectedSpecies = speciesPayload.at(0)

    cy.intercept(`GET`, `/gxa/sc/json/gene-search`, resultList)
    cy.intercept(
      {
        method: `GET`,
        pathname: `/gxa/sc/json/gene-search`,
        query: {
          species: selectedSpecies,
        }
      },
      selectedResultList
    )

    cy.mount(<FacetedSearchContainer {...props} />)
    // cy.get(`input[type="checkbox"]`).first().click()
    cy.get(':nth-child(2) > :nth-child(2) > label').click()
    cy.get(`div.small-12.medium-8.large-9.columns>div>div>div>p`)
      .as(`selectedTitles`)
      .should((selectedTitles) => {
        expect(selectedTitles.length).to.be.lessThan(resultList.results.length)
      })
    cy.get(`input[type="checkbox"]`).first().click()
    cy.get(`div.small-12.medium-8.large-9.columns>div>div>div>p`)
      .as(`selectedTitles`)
      .should((selectedTitles) => {
        expect(selectedTitles.length).to.equal(props.results.length)
      })
  })

  it(`clicking on a second facet works`, () => {
    cy.mount(<FacetedSearchContainer {...props} />)
    cy.get(`input[type="checkbox"]`).first().click()
    cy.get(`div.small-12.medium-8.large-9.columns>div>div>div>p`)
      .then((selectedTitles) => {
        cy.get(`input[type="checkbox"]`).eq(1).click().then(() => {
          cy.get(`div.small-12.medium-8.large-9.columns>div>div>div>p`)
            .then((moreSelectedTitles) => {
              expect(moreSelectedTitles.length)
                .to.be.greaterThan(selectedTitles.length)
            })
        })
      })
  })

  it(`doesn’t display duplicated facets`, () => {
    cy.intercept(`GET`, `/gxa/sc/json/gene-search`, resultList)

    cy.mount(<FacetedSearchContainer {...props}/>)

    let checkboxLabels = []
    let uniqueness = true
    cy.contains(`Species`).siblings().get(`label`)
      .each((label) => {
        const labelValue = label[0].innerHTML
        if (!checkboxLabels.includes(labelValue)) {
          checkboxLabels.push(labelValue)
        } else {
          uniqueness = false
        }
      }).then(() => {
        expect(uniqueness).is.true
      })

    let dropdownTitles = []

    cy.get(`input#facetGroupMultiSelectDropdown`)
      .first()
      .as(`selectedDropdown`)

    cy.get(`@selectedDropdown`)
      .click({force: true})

    cy.get(`@selectedDropdown`)
      .invoke(`attr`, `aria-controls`)
      .as(`dropdownMenuId`)

    cy.get(`@dropdownMenuId`).get(`div[class$="-MenuList"]`).first().then((selectedTitles) => {
        Object.values(selectedTitles)[0].childNodes.forEach(node => {
          let label = dropdownTitles.push(node.innerText)
          if (!dropdownTitles.includes(label)) {
            dropdownTitles.push(label)
          } else {
            uniqueness = false
          }
        })
      }).then(() => {
      expect(uniqueness).is.true
    })
  })
})
