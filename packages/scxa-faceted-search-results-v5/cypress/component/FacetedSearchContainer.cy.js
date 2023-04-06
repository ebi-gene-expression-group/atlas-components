import React from "react"

import FacetedSearchContainer from '../../src/FacetedSearchContainer'

import { ExperimentTableHeader, ExperimentTableCard,
  getRandomSpecies, getRandomOrganismParts, getRandomCellTypes } from './TestUtils'
import episodes from '../fixtures/episodesResponse.json'
import selectedEpisodes from '../fixtures/selectedEpisodesResponse.json'
import lessSelectedEpisodes from '../fixtures/lessSelectedEpisodesResponse.json'

describe(`FacetedSearchContainer`, () => {
  const props = {
    results: episodes,
    host: `/gxa/sc/`,
    queryParams: [],
    filterListEndpoint: `json/gene-search`,
    ResultsHeaderClass: ExperimentTableHeader,
    ResultElementClass: ExperimentTableCard
  }
  const markerGenePayloadTrue = `true`
  const markerGenePayloadFalse = `false`
  const speciesPayload = getRandomSpecies()
  const organismPartsPayload = getRandomOrganismParts()
  const cellTypePayload = getRandomCellTypes()
  const resultList = { results: episodes }
  const resultListBySelection = { results: selectedEpisodes }
  const resultListWithLessResult = { results: lessSelectedEpisodes }
  const emptyResponse = []

  beforeEach(() => {
      cy.intercept(`GET`, `/gxa/sc/json/gene-search/marker-genes`, markerGenePayloadTrue)
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
    cy.intercept(`GET`, `/gxa/sc/json/gene-search/marker-genes`, markerGenePayloadFalse)
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
    cy.intercept(`GET`, `/gxa/sc/json/gene-search`, resultList)
    cy.intercept(
      {
        method: `GET`,
        pathname: `/gxa/sc/json/gene-search`,
        query: {
          isMarkerGenes: markerGenePayloadTrue,
        }
      },
      resultListBySelection
    )

    cy.mount(<FacetedSearchContainer {...props} />)
    cy.get(`input[type="checkbox"]`).first().click()
    // cy.get(':nth-child(2) > :nth-child(2) > label').click()
    cy.get(`div.small-12.medium-8.large-9.columns>div>div>div>p`)
      .then((selectedTitles) => {
        expect(selectedTitles.length).to.be.lessThan(resultList.results.length)
        cy.get(`input[type="checkbox"]`).first().click()
        cy.get(`div.small-12.medium-8.large-9.columns>div>div>div>p`)
          .then( (selectedTitles2) => {
            expect(selectedTitles2.length).to.equal(resultList.results.length)
          })
      })
  })

  it(`clicking on a second facet works`, () => {
    cy.intercept(`GET`, `/gxa/sc/json/gene-search`, resultList)
    cy.intercept(
      {
        method: `GET`,
        pathname: `/gxa/sc/json/gene-search`,
        query: {
          isMarkerGenes: markerGenePayloadTrue,
        }
      },
      resultListBySelection
    )
    cy.intercept(
      {
        method: `GET`,
        pathname: `/gxa/sc/json/gene-search`,
        query: {
          isMarkerGenes: markerGenePayloadTrue,
          species: speciesPayload[0],
        }
      },
      resultListWithLessResult
    )

    cy.mount(<FacetedSearchContainer {...props} />)
    cy.get(`input[type="checkbox"]`).first().click({force:true})
    cy.get(`div.small-12.medium-8.large-9.columns>div>div>div>p`)
      .then((selectedTitles) => {
        cy.get(`input[type="checkbox"]`).eq(1).click().then(() => {
          cy.get(`div.small-12.medium-8.large-9.columns>div>div>div>p`)
            .then((lessSelectedTitles) => {
              expect(lessSelectedTitles.length)
                .to.be.lessThan(selectedTitles.length)
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
