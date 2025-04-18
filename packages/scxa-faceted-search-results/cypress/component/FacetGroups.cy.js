import React from 'react'

import CheckboxFacetGroup from '../../src/facetgroups/CheckboxFacetGroup'
import MultiselectDropdownFacetGroup from '../../src/facetgroups/MultiselectDropdownFacetGroup'

import vindicators from '../fixtures/vindicators.json'
import { getRandomInt } from './TestUtils'

function getFacetTypes(facets) {
  return [...new Set(facets.map((facet) => facet.group))]
}

const props = {
  facetGroupName: `Vindicators`,
  facets: [],
  onChange: () => {}
}

describe(`CheckboxFacetGroup`, () => {

  beforeEach(() => {
    while (props.facets.length === 0) {
      props.facets = vindicators.filter(() => Math.random() > 0.5)
    }
    props.facets = props.facets.map(e => ({...e, disabled: false}))
  })

  it(`renders the right number of checkboxes and the facet name`, () => {
    cy.mount(<CheckboxFacetGroup {...props} />)

    cy.get(`input`).should((inputs) => {
      expect(inputs.length).to.equal(props.facets.length)
    })
    cy.get(`input[type="checkbox"]`).should((checkboxes) => {
      expect(checkboxes.length).to.equal(props.facets.length)
    })
    cy.get(`h4`).should((header4s) => {
      expect(header4s.length).to.equal(getFacetTypes(props.facets).length)
    })
    cy.get(`h4`).invoke(`text`).then((headerText) => {
      expect(headerText).to.equal(props.facetGroupName)
    })
    cy.get(`input`).should(`not.have.attr`, `disabled`)
    cy.get(`label`).should(`not.have.attr`, `color`)
  })

  it(`displays disabled check boxes greyed out`, () => {
    props.facets = props.facets.map(e => ({...e, disabled: true}))
    cy.mount(<CheckboxFacetGroup {...props} />)

    cy.get(`input`).should(`have.attr`, `disabled`)
    cy.get(`label`)
      .should(`have.attr`, `style`)
      .should(`eq`, `color: lightgrey;`)
  })

  it(`callback is called when a checkbox is checked/unchecked with the right arguments`, () => {
    const randomCheckboxIndex = getRandomInt(0, props.facets.length)
    const mockCallbackWrapper = {
      onChange: function(facetGroup, checkedFacets) {
      }
    }
    cy.spy(mockCallbackWrapper, `onChange`).as(`onChange`)

    cy.mount(<CheckboxFacetGroup {...props} onChange={mockCallbackWrapper.onChange} />)

    cy.get(`input[type="checkbox"]`).eq(randomCheckboxIndex).click()
    cy.get(`@onChange`)
      .should(`have.been.calledOnceWithExactly`,
          props.facets[randomCheckboxIndex].group,
          [props.facets[randomCheckboxIndex]]
      )

    cy.get(`input[type="checkbox"]`).eq(randomCheckboxIndex).click()
    cy.get(`@onChange`)
      .should(`have.been.callCount`, 2)
      .should(`calledWithExactly`,
        props.facets[randomCheckboxIndex].group, []
      )
  })
})

describe(`MultiselectDropdownFacetGroup`, () => {

  beforeEach(() => {
    props.facets = vindicators
  })

  it(`callback includes facet name in arguments`, () => {
    const mockCallbackWrapper = {
      onChange: function(facetGroup, checkedFacets) {
      }
    }
    cy.spy(mockCallbackWrapper, `onChange`).as(`onChange`)
    const randomIndex = getRandomInt(0, props.facets.length)
    const valueToType = vindicators[randomIndex].label

    cy.mount(<MultiselectDropdownFacetGroup {...props} onChange={mockCallbackWrapper.onChange} />)
    cy.get(`input#facetGroupMultiSelectDropdown`)
      .type(`${valueToType}{enter}`)

    cy.get(`@onChange`)
      .should(`have.been.calledOnceWithExactly`,
            props.facetGroupName, [props.facets[randomIndex]]
      )
  })
})
