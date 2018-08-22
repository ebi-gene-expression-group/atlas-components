import React from 'react'
import Enzyme from 'enzyme'
import {mount} from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import fetchMock from 'fetch-mock'
import URI from 'urijs'

import Autocomplete from '../src/Autocomplete.js'
import AsyncCreatableSelect from 'react-select/lib/AsyncCreatable'

Enzyme.configure({ adapter: new Adapter() })

const props = {
  atlasUrl: `foo/`,
  actionEndpoint: `bar`,
  suggesterEndpoint: `suggest`,
  onChange: () => {}
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

describe(`Autocomplete`, () => {
  test(`displays the default value`, () => {
    const wrapper = mount(<Autocomplete {...props} defaultValue={defaultValue}/>)
    expect(wrapper.find(AsyncCreatableSelect).props().defaultValue).toEqual({
      label: defaultValue.term,
      value: JSON.stringify(defaultValue)
    })
  })
})

describe(`Autocomplete suggestions fetch`, () => {
  beforeEach(() => {
    fetchMock.restore()
  })

  test(`calls suggester with selected species as request parameter`, () => {
    fetchMock.get(`*`, [])

    const randomSpecies = species[Math.floor(Math.random() * species.length)]
    mount(<Autocomplete {...props} selectedSpecies={randomSpecies}/>)
    expect(fetchMock.calls()).toHaveLength(1)
    expect(URI(fetchMock.lastUrl()).search(true)).toHaveProperty(`species`, randomSpecies)
  })

  test(`calls suggester with all species as request parameter if no selected species is provided`, () => {
    fetchMock.get(`*`, [])

    mount(<Autocomplete {...props} allSpecies={species}/>)
    expect(fetchMock.calls()).toHaveLength(1)
    expect(URI(fetchMock.lastUrl()).search(true)).toHaveProperty(`species`, species.join(`,`))

  })
})
