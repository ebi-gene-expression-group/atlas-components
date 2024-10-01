import React from "react"

import CellTypeWheelExperimentHeatmap from '../../src/CellTypeWheelExperimentHeatmap'
import speciesResponse from '../fixtures/speciesResponse.json'
import cellTypeWheelData from '../fixtures/CellTypeDataForWheelResponse.json'
import heatMapTCellResponse from '../fixtures/heatMapRegulatoryTCellResponse.json'
import URI from 'urijs'
import {decode as base64_decode, encode as base64_encode} from 'base-64';

function firstWordMatcherOf(str) {
  return new RegExp(`.${str.split(` `)[0]}*`)
}

describe(`CellTypeWheelExperimentHeatmap`, () => {
  let props = {}

  beforeEach(() => {
    props = {
      searchTerm: `t cell`
    }
    cy.intercept(`GET`, `/gxa/sc/json/cell-type-wheel/t%20cell`,
      cellTypeWheelData)
  })

  it(`mounts without data and without species provider`, () => {
    cy.viewport(800, 1000)
    cy.mount(<CellTypeWheelExperimentHeatmap
      {...props}
    />)
    cy.contains(`Failed fetching species`)
  })

  it(`when the search term is empty then the cell type wheel is not displayed`, () => {
    props.searchTerm = ``
    cy.intercept(`GET`, `/gxa/sc/json/suggestions/species`,
      speciesResponse)
    const emptySearchTermSelector = `[aria-label='Empty search term']`
    cy.viewport(800, 1000)
    cy.mount(<CellTypeWheelExperimentHeatmap
      {...props}
    />)
    cy.get(emptySearchTermSelector)
      .should(`have.text`,
        `Please enter a search term to be able to see the distribution of cell types across species.`)
  })

  it(`mounts with data and check if the cell type wheel is displayed`, () => {
    const cellType = `regulatory T cell`
    cy.intercept(`GET`, `/gxa/sc/json/suggestions/species`,
      speciesResponse)
    cy.intercept(`GET`, `/gxa/sc/json/cell-type-marker-genes/${URI(encodeURIComponent(base64_encode(cellType)))}?experiment-accessions=E-ENAD-15`,
      heatMapTCellResponse)
    cy.viewport(800, 1000)
    cy.mount(<CellTypeWheelExperimentHeatmap
      {...props}
    />)
    cy.get(`.highcharts-title`)
      .invoke(`text`)
      .then(text => assert.isTrue(firstWordMatcherOf(props.searchTerm).test(text)))
  })

  it(`mounts with data and displays a heatmap when a cell type label is clicked`, () => {
    const cellType = `regulatory T cell`
    cy.intercept(`GET`, `/gxa/sc/json/suggestions/species`,
      speciesResponse)
    cy.intercept(`GET`, `/gxa/sc/json/cell-type-marker-genes/${URI(base64_encode(cellType))}?experiment-accessions=E-ENAD-15`,
      heatMapTCellResponse)
    cy.viewport(800, 1000)
    cy.mount(<CellTypeWheelExperimentHeatmap
      {...props}
    />)

    cy.contains(cellType).click({ force: true })
    heatMapTCellResponse.forEach(
      cell => cy.contains(cell.geneName)
    )
  })

  it(`mounts with data and displays a heatmap when a cell type label containing a forward slash is clicked`, () => {
    const cellTypeWithSlash = `mucosal invariant / T cell`
    cy.intercept(`GET`, `/gxa/sc/json/suggestions/species`,
      speciesResponse)
    cy.intercept(`GET`, `/gxa/sc/json/cell-type-marker-genes/${URI(base64_encode(cellTypeWithSlash))}?experiment-accessions=E-MTAB-7704`,
      heatMapTCellResponse)
    cy.viewport(800, 1000)
    cy.mount(<CellTypeWheelExperimentHeatmap
      {...props}
    />)

    cy.contains(cellTypeWithSlash).click({ force: true })
    heatMapTCellResponse.forEach(
      cell => cy.contains(cell.geneName)
    )
  })

  it(`species filter defaults to 'Any' if the species is not provided`, () => {
    cy.intercept(`GET`, `/gxa/sc/json/suggestions/species`, speciesResponse)

    cy.viewport(800, 1000)
    cy.mount(<CellTypeWheelExperimentHeatmap{...props}/>)

    cy.get(`[data-cy='speciesDropDown']`)
      .get(`div[class$='ValueContainer']`)
      .last()
      .invoke(`text`)
      .should(`eq`, `Any`)
  })

  it(`species filter defaults to 'Any' if the provided species variable is empty`, () => {
    props.species = ``

    cy.intercept(`GET`, `/gxa/sc/json/suggestions/species`, speciesResponse)

    cy.viewport(800, 1000)
    cy.mount(<CellTypeWheelExperimentHeatmap{...props}/>)

    cy.get(`[data-cy='speciesDropDown']`)
      .get(`div[class$='ValueContainer']`)
      .last()
      .invoke(`text`)
      .should(`eq`, `Any`)
  })

  it(`species filter selects the species value if it is provided`, () => {
    const givenSpecies = `Mus musculus`
    props.species = givenSpecies

    cy.intercept(`GET`, `/gxa/sc/json/suggestions/species`, speciesResponse)

    cy.viewport(800, 1000)
    cy.mount(<CellTypeWheelExperimentHeatmap{...props}/>)

    cy.get(`[data-cy='speciesDropDown']`)
      .get(`div[class$='ValueContainer']`)
      .last()
      .invoke(`text`)
      .should(`eq`, givenSpecies)
  })
})
