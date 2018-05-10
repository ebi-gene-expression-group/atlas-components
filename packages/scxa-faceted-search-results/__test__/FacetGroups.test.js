import React from 'react'
import renderer from 'react-test-renderer'
import Enzyme from 'enzyme'
import {mount} from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

import CheckboxFacetGroup from '../src/facetgroups/CheckboxFacetGroup'
import MultiselectDropdownFacetGroup from '../src/facetgroups/MultiselectDropdownFacetGroup'
import Select from 'react-select'

Enzyme.configure({ adapter: new Adapter() })

// Stolen from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
const getRandomInt = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}

const vindicators = [
  { value: `supernova`, label: `Supernova`},
  { value: `noob-noob`, label: `Noob-Noob` },
  { value: `vance_maximus`, label: `Vance Maximus`},
  { value: `alan_rails`, label: `Alan Rails`},
  { value: `crocubot`, label: `Crocubot` },
  { value: `million_ants`, label: `Million Ants`},
  { value: `morty_smith`, label: `Morty Smith`},
  { value: `rick_sanchez`, label: `Rick Sanchez`},
  { value: `lady_katana`, label: `Lady Katana`},
  { value: `calypso`, label: `Calypso`},
  { value: `diablo_verde`, label: `Diablo Verde`}
]

const props = {
  facetName: `Vindicators`,
  hideName: false,
  facetItems: [],
  onChange: () => {}
}

describe(`CheckboxFacetGroup`, () => {
  beforeEach(() => {
    const facetItems = []
    while (props.facetItems.length === 0) {
      props.facetItems = vindicators.filter((vindicator) => Math.random() > 0.5)
    }
  })

  test(`renders the right number of checkboxes and the facet name`, () => {
    const wrapper = mount(<CheckboxFacetGroup {...props} />)
    expect(wrapper.find(`input`)).toHaveLength(props.facetItems.length)
    expect(wrapper.find({ type: `checkbox` })).toHaveLength(props.facetItems.length)
    expect(wrapper.find(`h4`)).toHaveLength(1)
    expect(wrapper.find(`h4`).text()).toEqual(props.facetName)
  })

  test(`can hide the header`, () => {
    const wrapper = mount(<CheckboxFacetGroup {...props} hideName={true} />)
    expect(wrapper.find(`h4`)).toHaveLength(0)
  })

  test(`callback is called when a checkbox is checked/unchecked with the right arguments`, () => {
    const randomCheckboxIndex = getRandomInt(0, props.facetItems.length)
    const mockCallback = jest.fn()
    const wrapper = mount(<CheckboxFacetGroup {...props} onChange={mockCallback} />)
    wrapper.find({ type: `checkbox` }).at(randomCheckboxIndex).simulate(`change`)
    expect(mockCallback.mock.calls.length).toBe(1)
    expect(mockCallback.mock.calls[0]).toEqual([`Vindicators`, [props.facetItems[randomCheckboxIndex]]])
    wrapper.find({ type: `checkbox` }).at(randomCheckboxIndex).simulate(`change`)
    expect(mockCallback.mock.calls.length).toBe(2)
    expect(mockCallback.mock.calls[1]).toEqual([`Vindicators`, []])
  })

  test(`matches snapshot`, () => {
    const tree = renderer.create(<CheckboxFacetGroup {...props} facetItems={vindicators}/>).toJSON()
    expect(tree).toMatchSnapshot()
  })
})

// I would’ve liked to test the MultiselectDropdownFacetGroup component a bit more, for instance some workflow like
// “clicking on the component opens up the menu and choosing an option invokes the callback with the right arguments”
// (similar to CheckboxFacetGroup above) but I tried simulating a click event on a number of components (even the
// dropdown indicator) and nothing happened. It turns out that React-Select isn’t very straightforward when it comes to
// testing, as one can see in e.g. https://github.com/JedWatson/react-select/blob/v2/src/__tests__/Select.test.js.
// Still, a good deal of such a test would end up in testing-the-behaviour-of-third-party-software territory, so below
// is the minimum I think we should at least cover (snapshot tests would be pretty dumb, though). Fortunately coverage
// of React-Select is very good and the people behind the component are using Jest and Enzyme too, so if at any point
// we really want to do some complex testing we can have a look at the repo to learn how to do so... properly.
describe(`MultiselectDropdownFacetGroup`, () => {
  beforeEach(() => {
    const facetItems = []
    while (props.facetItems.length === 0) {
      props.facetItems = vindicators.filter((vindicator) => Math.random() > 0.5)
    }
  })

  test(`can hide the header`, () => {
    const wrapper = mount(<CheckboxFacetGroup {...props} hideName={true} />)
    expect(wrapper.find(`h4`)).toHaveLength(0)
  })

  test(`callback includes facet name in arguments`, () => {
    const mockCallback = jest.fn()
    const wrapper = mount(<MultiselectDropdownFacetGroup {...props} onChange={mockCallback} />)
    wrapper.find(Select).instance().onChange()
    expect(mockCallback.mock.calls.length).toBe(1)
    expect(mockCallback.mock.calls[0][0]).toEqual(props.facetName)
  })

})
