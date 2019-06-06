import React from 'react'
import renderer from 'react-test-renderer'
import { shallow } from 'enzyme'
import fetchMock from 'fetch-mock'
import URI from 'urijs'

import '@babel/polyfill'
import Autocomplete from '../src/Autocomplete'
import AsyncCreatableSelect from 'react-select/async-creatable'

const getRandomInt = (max) => Math.floor(Math.random() * Math.floor(max))

const props = {
  atlasUrl: `foo/`,
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
    const wrapper = shallow(<Autocomplete {...props} defaultValue={defaultValue} />)
    expect(wrapper.find(AsyncCreatableSelect).props().defaultValue).toEqual({
      label: defaultValue.term,
      value: JSON.stringify(defaultValue)
    })
  })

  test(`matches snapshot`, () => {
    const tree =
      renderer
        .create(<Autocomplete Autocomplete {...props} defaultValue={defaultValue} allSpecies={species} />)
        .toJSON()
    expect(tree).toMatchSnapshot()
  })
})

describe(`Autocomplete suggestions fetch`, () => {
  beforeEach(() => {
    fetchMock.restore()
  })

  test(`calls suggester with selected species as request parameter`, () => {
    fetchMock.get(`*`, [])

    const randomSpecies = species[getRandomInt(species.length)]
    const wrapper =
      shallow(<Autocomplete {...props} selectedSpecies={randomSpecies} />)
        .find(AsyncCreatableSelect).dive()

    wrapper.simulate(`inputChange`, `yeah`)

    expect(fetchMock.calls()).toHaveLength(1)
    expect(URI(fetchMock.lastUrl()).search(true)).toHaveProperty(`species`, randomSpecies)
  })

  test(`calls suggester with all species as request parameter if no selected species is provided`, () => {
    fetchMock.get(`*`, [])

    const wrapper =
      shallow(<Autocomplete {...props} allSpecies={species} />)
        .find(AsyncCreatableSelect).dive()

    wrapper.simulate(`inputChange`, `yeah`)

    expect(fetchMock.calls()).toHaveLength(1)
    expect(URI(fetchMock.lastUrl()).search(true)).toHaveProperty(`species`, species.join(`,`))

  })
})
