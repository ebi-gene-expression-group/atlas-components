import React from 'react'
import Enzyme from 'enzyme'
import {mount} from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

import GeneSearchForm from '../src/GeneSearchForm.js'
// import AsyncCreatableSelect from 'react-select/lib/AsyncCreatable'

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

const species = [
  `Meeseek`,
  `Gromflomite`,
  `Cromulon`,
  `Zigerion`,
  `Moopian`,
  `Bliznarvian`,
  `Greebybobe`
]

describe(`GeneSearchForm`, () => {
  test(`search button is initially disabled`, () => {
    const wrapper = mount(<GeneSearchForm {...props}/>)
    expect(wrapper.find(`button`).at(0).props()).toHaveProperty(`disabled`, true)
  })

  test(`search button with invalid default value is disabled`, () => {
    const wrapper = mount(<GeneSearchForm {...props} defaultValue={{term: `   `, category: `q`}}/>)
    expect(wrapper.find(`button`).at(0).props()).toHaveProperty(`disabled`, true)
  })

  test(`search button with valid default value is enabled`, () => {
    const wrapper = mount(<GeneSearchForm {...props} defaultValue={defaultValue}/>)
    expect(wrapper.find(`button`).at(0).props()).toHaveProperty(`disabled`, false)
  })

})
