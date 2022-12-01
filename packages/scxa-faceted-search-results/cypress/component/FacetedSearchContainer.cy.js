import React from "react"

import FacetedSearchContainer from '../../src/FacetedSearchContainer'

import { episodes, ExperimentTableHeader, ExperimentTableCard } from './TestUtils'

describe(`FacetedSearchContainer`, () => {
  const facetGroupTitles = `Season`

  const props = {
    results: episodes,
    checkboxFacetGroups: [facetGroupTitles],
    ResultsHeaderClass: ExperimentTableHeader,
    ResultElementClass: ExperimentTableCard
  }

  it(`when results have facets they are displayed along with the results list`, () => {
    cy.mount(<FacetedSearchContainer {...props} />)
    cy.get(`input#facetGroupMultiSelectDropdown`)
  })

  it(`when results have no facets only the results list is displayed`, () => {
    cy.mount(<FacetedSearchContainer {...props}
      results={props.results.map((result) => ({element: result.element}))}/>)
    cy.get(`input#facetGroupMultiSelectDropdown`).should(`not.exist`)
  })

  it(`clicking to select/unselect a single facet in a group works`, () => {
    cy.mount(<FacetedSearchContainer {...props} />)
    cy.get(`input[type="checkbox"]`).first().click()
    cy.get(`div.small-12.medium-8.large-9.columns>div>div>div>p`)
      .as(`selectedTitles`)
      .should((selectedTitles) => {
        expect(selectedTitles.length).to.be.lessThan(props.results.length)
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
    cy.mount(<FacetedSearchContainer {...props}/>)

    // TODO: simplify this messy code
    // TODO: code fragement from the original (broken) test case
    // wrapper.find(CheckboxFacetGroup).forEach(
    //   (facetGroup) =>
    //     expect(facetGroup.props().facets)
    // .toHaveLength(uniqueFacetsByGroup[facetGroup.props().facetGroupName].length))
    let checkboxLabels = []
    let uniqueness = true
    cy.contains(facetGroupTitles).siblings().get(`label`)
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
    cy.get(`div.css-qbdosj-Input`).first().click()
    cy.get(`div.css-dzz542-menu`).then(() => {
      cy.get(`div.css-1n6sfyn-MenuList`).then((selectedTitles) => {
        Object.values(selectedTitles)[0].childNodes.forEach(node => {
          let label = dropdownTitles.push(node.innerText)
          if (!dropdownTitles.includes(label)) {
            dropdownTitles.push(label)
          } else {
            uniqueness = false
          }
        })
      })
    }).then(() => {
      expect(uniqueness).is.true
    })
    
    // TODO: code fragement from the original (broken) test case
    // wrapper.find(MultiselectDropdownFacetGroup).forEach(
    //   (facetGroup) =>
    //       expect(facetGroup.props().facets)
            // .toHaveLength(uniqueFacetsByGroup[facetGroup.props().facetGroupName].length))
  })
})
