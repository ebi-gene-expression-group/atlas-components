import React from 'react'
import renderer from 'react-test-renderer'
import Enzyme from 'enzyme'
import { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

import GeneSearchForm from '../src/GeneSearchForm.js'
import Autocomplete from '../src/Autocomplete'
import LabelledSelect from '../src/LabelledSelect'

import * as species from './utils/species'

Enzyme.configure({ adapter: new Adapter() })

const props = {
  atlasUrl: `foo/`,
  actionEndpoint: `bar`,
  suggesterEndpoint: `suggest`,
  enableSpeciesSelect: true
}

const defaultValue = {
  term: `foo`,
  category: `bar`
}

const generateEmptyString = () => {
  const getRandomInt = (max) => Math.floor(Math.random() * Math.floor(max))
  const randomSpaceChar = () => [``, `\t`, ` `, `\n`][getRandomInt(4)]

  let decreasingThreshold = 0.9
  let blankString = ``
  while (Math.random() < decreasingThreshold) {
    blankString = blankString + randomSpaceChar()
    decreasingThreshold = decreasingThreshold * decreasingThreshold
  }

  return blankString
}

describe(`GeneSearchForm`, () => {
  test(`search button is initially disabled`, () => {
    const wrapper = shallow(<GeneSearchForm {...props}/>)
    expect(wrapper.find(`button`).at(0).props()).toHaveProperty(`disabled`, true)
  })

  test(`search button with invalid default value (i.e. empty term) is disabled`, () => {
    const emptyString = generateEmptyString()
    expect(emptyString).toMatch(/\s*/)

    const wrapper = shallow(<GeneSearchForm {...props} defaultValue={{term: emptyString, category: `q`}}/>)
    expect(wrapper.find(`button`).at(0).props()).toHaveProperty(`disabled`, true)
  })

  test(`search button with valid default value is enabled`, () => {
    const wrapper = shallow(<GeneSearchForm {...props} defaultValue={defaultValue}/>)
    expect(wrapper.find(`button`).at(0).props()).toHaveProperty(`disabled`, false)
  })

  test(`defaults to category 'q' (after 'query') if none is given in the default value`, () => {
    const defaultValue = {term: `foo`}
    const wrapper = shallow(<GeneSearchForm {...props} defaultValue={defaultValue}/>)
    expect(wrapper.state(`query`)).toEqual({...defaultValue, category: `q`})
  })

  test(`defaults to category 'q' (after 'query') if an empty category is passed in the default value`, () => {
    const emptyString = generateEmptyString()
    expect(emptyString).toMatch(/\s*/)

    const defaultValue = {term: `foo`, category: emptyString}
    const wrapper = shallow(<GeneSearchForm {...props} defaultValue={defaultValue}/>)
    expect(wrapper.state(`query`)).toEqual({...defaultValue, category: `q`})
  })

  test(`a change in species updates the state`, () => {
    const speciesToSelect = species.getRandom()
    const wrapper = shallow(<GeneSearchForm {...props} defaultValue={defaultValue}/>)
    wrapper.find(LabelledSelect).simulate(`change`, {label: speciesToSelect, value: speciesToSelect})
    expect(wrapper.state(`selectedSpecies`)).toEqual(speciesToSelect)
  })

  test(`a change in the gene query search box updates the state`, () => {
    const optionValueToSelect = {
      term: `foo`,
      category: `bar`
    }
    const wrapper = shallow(<GeneSearchForm {...props} defaultValue={defaultValue}/>)

    // Select an element from the suggestions
    wrapper.find(Autocomplete)
      .simulate(
        `change`,
        {
          label: `foo`,
          value: JSON.stringify(optionValueToSelect)
        })
    expect(wrapper.state(`query`)).toEqual(optionValueToSelect)

    // Clear the search term
    wrapper.find(Autocomplete)
      .simulate(`change`, null)
    expect(wrapper.state(`query`)).toEqual({})
    expect(wrapper.find(`button`).at(0).props()).toHaveProperty(`disabled`, true)
  })

  test(`matches snapshot`, () => {
    const tree = renderer.create(<GeneSearchForm {...props}/>).toJSON()
    expect(tree).toMatchSnapshot()
  })
})
