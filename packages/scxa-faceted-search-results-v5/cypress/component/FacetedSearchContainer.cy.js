import React from 'react'

import FacetedSearchContainer from '../../src/FacetedSearchContainer'

import {
  ExperimentTableHeader, ExperimentTableCard,
  getRandomSpecies, getRandomOrganismParts, getRandomCellTypes
} from './TestUtils'
import episodes from '../fixtures/episodesResponse.json'
import selectedEpisodes from '../fixtures/selectedEpisodesResponse.json'
import selectedEpisodesAndOneSpecies from '../fixtures/selectedEpisodesAndOneOtherSelectedFilterResponse.json'
import selectedEpisodesAndTwoCellTypes from '../fixtures/selectedEpisodesAndTwoOtherSelectedFilterResponse.json'
import fewerSelectedEpisodes from '../fixtures/lessSelectedEpisodesResponse.json'

describe(`FacetedSearchContainer`, () => {
  const props = {
    results: episodes,
    host: `/gxa/sc/`,
    queryParams: {},
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
  const resultListByMarkerGenesAndOneSpecies = { results: selectedEpisodesAndOneSpecies }
  const resultListByMarkerGenesAndOneCellTypes = { results: selectedEpisodesAndTwoCellTypes }
  const resultListByMarkerGenesAndTwoSpecies = { results: fewerSelectedEpisodes }
  const resultListByMarkerGenesAndTwoCellTypes = { results: selectedEpisodesAndTwoCellTypes }
  const resultListByMarkerGenesAndTwoCellTypesAndOneSpecies = { results: fewerSelectedEpisodes }
  const emptyResponse = []

  beforeEach(() => {
    mockRestCallsWithoutQueryParameters()
    mockRestCallsWithQueryParameters()
  }
  )

  function mockRestCallsWithoutQueryParameters() {
    cy.intercept(`GET`, `/gxa/sc/json/gene-search**`, resultList)
      .as(`randomListResponse`)
    cy.intercept(`GET`, `/gxa/sc/json/gene-search/marker**`, markerGenePayloadTrue)
      .as(`randomMarkerGenesResponse`)
    cy.intercept(`GET`, `/gxa/sc/json/gene-search/species**`, getRandomSpecies())
      .as(`randomSpeciesResponse`)
    cy.intercept(`GET`, `/gxa/sc/json/gene-search/organism**`, getRandomOrganismParts())
      .as(`randomOrganismPartsResponse`)
    cy.intercept(`GET`, `/gxa/sc/json/gene-search/cell**`, getRandomCellTypes())
      .as(`randomCellTypesResponse`)
    cy.intercept(`GET`, `/gxa/sc/json/gene-search/marker-genes`, markerGenePayloadTrue)
      .as(`initialMarkerGeneData`)
    cy.intercept(`GET`, `/gxa/sc/json/gene-search/species`, speciesPayload)
      .as(`initialSpeciesData`)
    cy.intercept(`GET`, `/gxa/sc/json/gene-search/organism-parts`, organismPartsPayload)
      .as(`initialOrganismPartsData`)
    cy.intercept(`GET`, `/gxa/sc/json/gene-search/cell-types`, cellTypePayload)
      .as(`initialCellTypesData`)
    cy.intercept(`GET`, `/gxa/sc/json/gene-search`, resultList)
      .as(`initialListResponse`)
  }

  function mockRestCallsWithQueryParameters() {
    cy.intercept(
      {
        method: `GET`,
        pathname: `/gxa/sc/json/gene-search`,
        query: {
          isMarkerGenes: markerGenePayloadTrue
        }
      },
      resultListBySelection
    ).as(`markerGeneOnlyListResponse`)

    cy.intercept(
      {
        method: `GET`,
        pathname: `/gxa/sc/json/gene-search`,
        query: {
          isMarkerGenes: markerGenePayloadTrue,
          cellTypes: cellTypePayload[0]
        }
      },
      resultListByMarkerGenesAndOneCellTypes
    ).as(`markerGeneAndOneCellTypeListResponse`)
    cy.intercept(
      {
        method: `GET`,
        pathname: `/gxa/sc/json/gene-search`,
        query: {
          isMarkerGenes: markerGenePayloadTrue,
          cellTypes: cellTypePayload[0] + `,` + cellTypePayload[1]
        }
      },
      resultListByMarkerGenesAndTwoCellTypes
    ).as(`markerGeneAndTwoCellTypeListResponse`)

    cy.intercept(
      {
        method: `GET`,
        pathname: `/gxa/sc/json/gene-search`,
        query: {
          isMarkerGenes: markerGenePayloadTrue,
          species: speciesPayload[0]
        }
      },
      resultListByMarkerGenesAndOneSpecies
    ).as(`markerGeneAndOneSpeciesListResponse`)
    cy.intercept(
      {
        method: `GET`,
        pathname: `/gxa/sc/json/gene-search`,
        query: {
          isMarkerGenes: markerGenePayloadTrue,
          species: speciesPayload[0] + `,` + speciesPayload[1]
        }
      },
      resultListByMarkerGenesAndTwoSpecies
    ).as(`markerGeneAndTwoSpeciesListResponse`)

    cy.intercept(
      {
        method: `GET`,
        pathname: `/gxa/sc/json/gene-search`,
        query: {
          isMarkerGenes: markerGenePayloadTrue,
          cellTypes: cellTypePayload[0] + `,` + cellTypePayload[1],
          species: speciesPayload[0]
        }
      },
      resultListByMarkerGenesAndTwoCellTypesAndOneSpecies
    )

    cy.intercept(
      {
        method: `GET`,
        pathname: `/gxa/sc/json/gene-search/cell-types`,
        query: {
          isMarkerGenes: markerGenePayloadTrue
        }
      },
      cellTypePayload
    )
    cy.intercept(
      {
        method: `GET`,
        pathname: `/gxa/sc/json/gene-search/cell-types`,
        query: {
          isMarkerGenes: markerGenePayloadTrue,
          cellTypes: cellTypePayload[0]
        }
      },
      cellTypePayload
    )

    cy.intercept(
      {
        method: `GET`,
        pathname: `/gxa/sc/json/gene-search/marker-genes`,
        query: {
          isMarkerGenes: markerGenePayloadTrue
        }
      },
      markerGenePayloadTrue
    )

    cy.intercept(
      {
        method: `GET`,
        pathname: `/gxa/sc/json/gene-search/species`,
        query: {
          isMarkerGenes: markerGenePayloadTrue
        }
      },
      speciesPayload
    )

    cy.intercept(
      {
        method: `GET`,
        pathname: `/gxa/sc/json/gene-search/organism-parts`,
        query: {
          isMarkerGenes: markerGenePayloadTrue
        }
      },
      organismPartsPayload
    )
  }

  it(`when results have facets they are displayed along with the results list`, () => {
    cy.mount(<FacetedSearchContainer {...props} />)
    cy.findAllByTestId(`facetGroupMultiSelectDropdown`).should(`have.length`, 2)
    cy.findAllByTestId(`facetGroupCheckBox`).should(`have.length`, 2)
    cy.findAllByTestId(`filterList`).should(`have.length`, 1)
  })

  it(`when results have no facets only the results list is displayed`, () => {
    // override some mocked REST calls that has been defined in the `beforeEach`
    cy.intercept(`GET`, `/gxa/sc/json/gene-search/marker-genes`, markerGenePayloadFalse)
    cy.intercept(`GET`, `/gxa/sc/json/gene-search/species`, emptyResponse)
    cy.intercept(`GET`, `/gxa/sc/json/gene-search/organism-parts`, emptyResponse)
    cy.intercept(`GET`, `/gxa/sc/json/gene-search/cell-types`, emptyResponse)

    cy.mount(<FacetedSearchContainer {...props} />)
    cy.findAllByTestId(`facetGroupMultiSelectDropdown`).should(`not.exist`)
    cy.findAllByTestId(`facetGroupCheckBox`).should(`not.exist`)
    cy.findAllByTestId(`filterList`).should(`have.length`, 1)
  })

  it(`clicking to select/unselect facets in checkbox groups works`, () => {
    cy.mount(<FacetedSearchContainer {...props} />)

    cy.wait(`@initialListResponse`)
    // click on is marker gene
    cy.get(`input[type="checkbox"]`).first().click()
    cy.wait(`@markerGeneOnlyListResponse`)
    cy.get(`div.small-12.medium-8.large-9.columns>div>div>div>p`).its(`length`)
      .then((selectedTitlesByMarkerGeneLength) => {
        expect(selectedTitlesByMarkerGeneLength).to.be.lessThan(resultList.results.length)

        // click on the 1st species checkbox
        cy.get(`:nth-child(2) > :nth-child(2) > input[type="checkbox"]`).click()
        cy.wait(`@markerGeneAndOneSpeciesListResponse`)
        cy.get(`div.small-12.medium-8.large-9.columns>div>div>div>p`).its(`length`)
          .then((selectedTitlesByMarkerGeneAndOneSpecies) => {
            expect(selectedTitlesByMarkerGeneAndOneSpecies).to.be.lessThan(resultList.results.length)
            expect(selectedTitlesByMarkerGeneAndOneSpecies).to.be.lessThan(selectedTitlesByMarkerGeneLength)

            // click on the 2nd species checkbox
            cy.get(`:nth-child(2) > :nth-child(3) > input[type="checkbox"]`).click()
            cy.wait(`@markerGeneAndTwoSpeciesListResponse`)
            cy.get(`div.small-12.medium-8.large-9.columns>div>div>div>p`).its(`length`)
              .then((selectedTitlesByMarkerGeneAndTwoSpecies) => {
                expect(selectedTitlesByMarkerGeneAndTwoSpecies).to.be.lessThan(resultList.results.length)
                expect(selectedTitlesByMarkerGeneAndTwoSpecies).to.be.lessThan(selectedTitlesByMarkerGeneAndOneSpecies)
                expect(selectedTitlesByMarkerGeneAndTwoSpecies).to.be.lessThan(selectedTitlesByMarkerGeneLength)
              })
          })
      })

    // revert the form to its initial state (no selections)
    cy.get(`:nth-child(2) > :nth-child(3) > input[type="checkbox"]`).click()
    cy.get(`:nth-child(2) > :nth-child(2) > input[type="checkbox"]`).click()
    cy.get(`input[type="checkbox"]`).first().click()

    cy.wait(`@initialListResponse`)
    cy.get(`div.small-12.medium-8.large-9.columns>div>div>div>p`)
      .then((selectedTitles2) => {
        expect(selectedTitles2.length).to.equal(resultList.results.length)
      })
  })

  it(`clicking to select/unselect facets in multi select dropdown groups works`, () => {
    cy.mount(<FacetedSearchContainer {...props} />)

    cy.wait(`@initialListResponse`)

    // click on is marker gene
    cy.get(`input[type="checkbox"]`).first().click()
    cy.wait(`@markerGeneOnlyListResponse`)
    cy.get(`div.small-12.medium-8.large-9.columns>div>div>div>p`).its(`length`)
      .then((selectedTitlesByMarkerGeneLength) => {
        expect(selectedTitlesByMarkerGeneLength).to.be.lessThan(resultList.results.length)

        // click on the 1st cell type checkbox
        cy.findAllByTestId(`facetGroupMultiSelectDropdown`)
          .get(`div[class$='ValueContainer']`)
          .first()
          .as(`selectedDropdown`)
          .click({ force: true })

        // click on the 1st cell type
        cy.get(`[id^=react-select-][id$=-option-0]`).click()

        cy.get(`@selectedDropdown`)
          .click({ force: true })

        // click on the 2nd cell type
        cy.get(`[id^=react-select-][id$=-option-1]`).click()
        cy.wait(`@markerGeneAndTwoCellTypeListResponse`)
        cy.get(`div.small-12.medium-8.large-9.columns>div>div>div>p`).its(`length`)
          .as(`selectedTitlesByMarkerGeneAndTwoCellTypes`)
          .then((selectedTitlesByMarkerGeneAndTwoCellTypes) => {
            expect(selectedTitlesByMarkerGeneAndTwoCellTypes).to.be.equal(
              resultListByMarkerGenesAndTwoCellTypes.results.length)
            expect(selectedTitlesByMarkerGeneAndTwoCellTypes).to.be.lessThan(resultList.results.length)
            expect(selectedTitlesByMarkerGeneAndTwoCellTypes).to.be.lessThan(selectedTitlesByMarkerGeneLength)
          })
      })

    // revert the form to its initial state (no selections)

    // unselect cell types
    cy.get(`[class$=-multiValue]>div>svg`).first().click()
    cy.get(`[class$=-multiValue]>div>svg`).first().click()

    // unselect the marker gene
    cy.get(`input[type="checkbox"]`).first().click()

    // assert if we got back the initial state
    cy.wait(`@initialListResponse`)
    cy.get(`div.small-12.medium-8.large-9.columns>div>div>div>p`)
      .then((selectedTitles2) => {
        expect(selectedTitles2.length).to.equal(resultList.results.length)
      })
  })

  it(`clicking on a second facet works`, () => {
    cy.mount(<FacetedSearchContainer {...props} />)

    cy.wait(`@initialListResponse`)

    cy.get(`input[type="checkbox"]`).first().click({ force: true })

    cy.wait(`@markerGeneOnlyListResponse`)

    cy.get(`div.small-12.medium-8.large-9.columns>div>div>div>p`)
      .then((selectedTitles) => {
        cy.get(`input[type="checkbox"]`).eq(1).click()
        cy.wait(`@markerGeneAndOneSpeciesListResponse`)
        cy.get(`div.small-12.medium-8.large-9.columns>div>div>div>p`)
          .then((lessSelectedTitles) => {
            expect(lessSelectedTitles.length)
              .to.be.lessThan(selectedTitles.length)
          })
      })
  })

  it(`doesn’t display duplicated facets`, () => {
    cy.mount(<FacetedSearchContainer {...props}/>)

    cy.wait(`@initialListResponse`)

    const checkboxLabels = []
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

    const dropdownTitles = []

    cy.findAllByTestId(`facetGroupMultiSelectDropdown`)
      .get(`div[class$='ValueContainer']`)
      .first()
      .as(`selectedDropdown`)

    cy.get(`@selectedDropdown`)
      .click({ force: true })

    cy.get(`@selectedDropdown`)
      .invoke(`attr`, `aria-controls`)
      .as(`dropdownMenuId`)

    cy.get(`@dropdownMenuId`).get(`div[class$="-MenuList"]`).first()
      .then((selectedTitles) => {
        Object.values(selectedTitles)[0].childNodes.forEach(node => {
          const label = dropdownTitles.push(node.innerText)
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
