import React from 'react'
import renderer from 'react-test-renderer'
import { shallow } from 'enzyme'

import '@babel/polyfill'
import GeneSearchForm from '../src/GeneSearchForm'
import Autocomplete from '../src/Autocomplete'
import LabelledSelect from '../src/LabelledSelect'
import SearchExamples from '../src/SearchExamples'

import * as species from './utils/species'
import searchExamples from './utils/searchExamples'

const props = {
  atlasUrl: `foo/`,
  actionEndpoint: `bar`,
  suggesterEndpoint: `suggest`,
  enableSpeciesSelect: true,
  searchExamples: searchExamples
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

  test(`if a function is passed via onSubmit, it is run when the Search button is clicked and the query is passed as args`, () => {
    const onSubmitMock = jest.fn()
    const wrapper = shallow(<GeneSearchForm {...props} onSubmit={onSubmitMock} />)

    const optionValueToSelect = {
      term: `foo`,
      category: `bar`
    }
    wrapper.find(Autocomplete)
      .simulate(
        `change`,
        {
          label: `foo`,
          value: JSON.stringify(optionValueToSelect)
        })

    const speciesToSelect = species.getRandom()
    wrapper.find(LabelledSelect).simulate(`change`, {label: speciesToSelect, value: speciesToSelect})

    const event = {
      target: `some-DOM-node`
    }
    wrapper.find(`button`).at(0).simulate(`click`, event)

    expect(onSubmitMock.mock.calls).toHaveLength(1)
    expect(onSubmitMock.mock.calls[0][0]).toEqual(event)
    expect(onSubmitMock.mock.calls[0][1]).toEqual(optionValueToSelect)
    expect(onSubmitMock.mock.calls[0][2]).toEqual(speciesToSelect)
  })

  test(`can optionally display search examples`, () => {
    expect(shallow(<GeneSearchForm {...props} />).find(SearchExamples)).toHaveLength(1)
    expect(shallow(<GeneSearchForm {...props} searchExamples={undefined} />).find(SearchExamples)).toHaveLength(0)
  })

  test(`matches snapshot`, () => {
    const tree = renderer.create(<GeneSearchForm {...props}/>).toJSON()
    expect(tree).toMatchSnapshot()
  })
})
