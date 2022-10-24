import React from "react"

import CellTypeWheelExperimentHeatmap from '../../src/CellTypeWheelExperimentHeatmap'
import speciesResponse from '../fixtures/speciesResponse.json'
import cellTypeWheelData from '../fixtures/CellTypeDataForWheelResponse.json'
import heatMapTCellResponse from '../fixtures/heatMapRegulatoryTCellResponse.json'

function firstWordMatcherOf (str) {
  return new RegExp(`.${str.split(` `)[0]}*`)
}

describe(`CellTypeWheelExperimentHeatmap`, () => {
  const props = {
    searchTerm: `t cell`
  }

  beforeEach(() => {
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

  it(`mounts with data and check if the cell type wheel is displayed`, () => {
    cy.intercept(`GET`, `/gxa/sc/json/suggestions/species`,
      speciesResponse)
    cy.intercept(`GET`, `/gxa/sc/json/cell-type-marker-genes/regulatory%20T%20cell?experiment-accessions=E-ENAD-15`,
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
    cy.intercept(`GET`, `/gxa/sc/json/suggestions/species`,
      speciesResponse)
    cy.intercept(`GET`, `/gxa/sc/json/cell-type-marker-genes/regulatory%20T%20cell?experiment-accessions=E-ENAD-15`,
      heatMapTCellResponse)
    cy.viewport(800, 1000)
    cy.mount(<CellTypeWheelExperimentHeatmap
      {...props}
    />)

    const ringElement = cy.contains(`regulatory T cell`)
    ringElement.click({ force: true })
    heatMapTCellResponse.map((cell) => cell.geneName).forEach(
      geneName => cy.contains(geneName)
    )
  })
})
