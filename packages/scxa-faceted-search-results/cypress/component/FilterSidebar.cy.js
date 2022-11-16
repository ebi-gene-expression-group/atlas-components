import React from "react"

import FilterSidebar from '../../src/FilterSidebar'

import { episodes, getUniqueFacets, getRandomInt } from './TestUtils'

describe(`FilterSidebar`, () => {
  const uniqueFacets = getUniqueFacets()
  const props = {
    facets: uniqueFacets,
    checkboxFacetGroups: [`Season`],
    results: episodes,
    onChange: () => {}
  }

  const noTooltipProps = {
    facets:[
      {
        group: `Guest character`,
        value: `birdperson`,
        label: `Birdperson`
      }],
    results: episodes,
    checkboxFacetGroups: [`Season`],
    onChange: () => {}
  }

  it(`shows checkbox facet groups above dropdown filters`, () => {
    const groups = [...new Set(uniqueFacets.map((facet) => facet.group))]
    const randomCheckboxFacetGroup = groups[getRandomInt(0, groups.length)]

    cy.mount(<FilterSidebar {...props} checkboxFacetGroups={[randomCheckboxFacetGroup]} />)
    cy.get(`div.padding-bottom-xlarge h4`)
      .first().invoke(`text`).then((firstCheckboxTitleText) => {
        expect(firstCheckboxTitleText).to.equal(randomCheckboxFacetGroup)
    })
    cy.get(`div.padding-bottom-xlarge h4`)
      .last().invoke(`text`).then((lastCheckboxTitleText) => {
        expect(lastCheckboxTitleText).not.to.equal(randomCheckboxFacetGroup)
    })
  })

  it(`checks whether tooltip exists`, () => {
    const groups = [...new Set(uniqueFacets.map((facet) => facet.group))]
    const randomCheckboxFacetGroup = groups[getRandomInt(0, groups.length)]

    cy.mount(<FilterSidebar {...props} checkboxFacetGroups={[randomCheckboxFacetGroup]} />)
    cy.get(`div.padding-bottom-xlarge h4 sup span`)
      .should(`have.attr`, `data-tip`)
  })

  it(`checks tooltip does not exist when no tooltip text in payload`, () => {
    const groups = [...new Set(uniqueFacets.map((facet) => facet.group))]
    const randomCheckboxFacetGroup = groups[getRandomInt(0, groups.length)]

    cy.mount(<FilterSidebar {...noTooltipProps} checkboxFacetGroups={[randomCheckboxFacetGroup]} />)
    cy.get(`div.padding-bottom-xlarge h4 sup`)
      .should(`not.exist`)
  })

  it(`hides checkbox if all results share the same facets`, () => {
    cy.mount(
      <FilterSidebar
        facets={uniqueFacets}
        checkboxFacetGroups={[`Show`, `Season`]}
        onChange={() => {}} />)
    cy.get(`input[type="checkbox"]`).should((checkBoxes) => {
      expect(checkBoxes.length).to.be.lessThan(uniqueFacets.length)
    })
  })
})
