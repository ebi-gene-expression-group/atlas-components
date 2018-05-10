import React from 'react'
import renderer from 'react-test-renderer'
import Enzyme from 'enzyme'
import {shallow, mount} from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

import CheckboxFacetGroup from '../src/facetgroups/CheckboxFacetGroup'

Enzyme.configure({ adapter: new Adapter() })

// Stolen from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
const getRandomInt = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}

describe(`CheckboxFacetGroup`, () => {
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
    facetItems: vindicators.filter((vindicator) => Math.random() > 0.5),
    onChange: () => {}
  }

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
