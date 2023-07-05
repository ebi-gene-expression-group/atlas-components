import React from "react"

import FilterList from '../../src/FilterList'

import episodes from '../fixtures/episodesResponse.json'
import { ExperimentTableHeader, ExperimentTableCard } from './TestUtils'

describe(`FilterList`, () => {
  const props = {
    filteredResults: episodes,
    ResultsHeaderClass: ExperimentTableHeader,
    ResultElementClass: ExperimentTableCard
  }

  it(`renders a table header and as many components of ResultElementClass as filtered results`, () => {
    cy.mount(<FilterList {...props} />)
    cy.get(`div h4`).should((tableHeader) => {
      expect(tableHeader).to.have.length(ExperimentTableHeader.length)
    })

    cy.get(`div div p`).should((tableCard) => {
      expect(tableCard).to.have.length(episodes.length)
    })
  })
})
