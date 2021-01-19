import React from 'react'
import renderer from 'react-test-renderer'
import Enzyme from 'enzyme'
import { mount } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

import { getRandomInt, vindicators } from './TestUtils'

import CheckboxFacetGroup from '../src/facetgroups/CheckboxFacetGroup'
import MultiselectDropdownFacetGroup from '../src/facetgroups/MultiselectDropdownFacetGroup'
import Select from 'react-select'

Enzyme.configure({ adapter: new Adapter() })

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
  })

  test(`renders the right number of checkboxes and the facet name`, () => {
    const wrapper = mount(<CheckboxFacetGroup {...props} />)
    expect(wrapper.find(`input`)).toHaveLength(props.facets.length)
    expect(wrapper.find({ type: `checkbox` })).toHaveLength(props.facets.length)
    expect(wrapper.find(`h4`)).toHaveLength(1)
    expect(wrapper.find(`h4`).text()).toEqual(expect.stringMatching(props.facetGroupName))
    // All checkboxes are enabled, cf. with next test
    const inputProps = wrapper.find(`input`).map((labelWrapper) => labelWrapper.props())
    inputProps.every((inputProp) => expect(inputProp).toHaveProperty(`disabled`, false))

    const labelStyles = wrapper.find(`label`).map((labelWrapper) => labelWrapper.props().style)
    labelStyles.every((labelStyle) => expect(labelStyle).not.toHaveProperty(`color`))
  })

  test(`displays disabled check boxes greyed out`, () => {
    props.facets = props.facets.map(e => ({...e, disabled: true}))
    const wrapper = mount(<CheckboxFacetGroup {...props} />)

    const inputProps = wrapper.find(`input`).map((labelWrapper) => labelWrapper.props())
    inputProps.every((inputProp) => expect(inputProp).toHaveProperty(`disabled`, true))

    const labelStyles = wrapper.find(`label`).map((labelWrapper) => labelWrapper.props().style)
    labelStyles.every((labelStyle) => expect(labelStyle).toHaveProperty(`color`, `lightgrey`))
  })

  test(`callback is called when a checkbox is checked/unchecked with the right arguments`, () => {
    const randomCheckboxIndex = getRandomInt(0, props.facets.length)
    const mockCallback = jest.fn()
    const wrapper = mount(<CheckboxFacetGroup {...props} onChange={mockCallback} />)
    wrapper.find({ type: `checkbox` }).at(randomCheckboxIndex).simulate(`change`)
    expect(mockCallback.mock.calls.length).toBe(1)
    expect(mockCallback.mock.calls[0]).toEqual([
      props.facets[randomCheckboxIndex].group,
      [props.facets[randomCheckboxIndex]]])
    wrapper.find({ type: `checkbox` }).at(randomCheckboxIndex).simulate(`change`)
    expect(mockCallback.mock.calls.length).toBe(2)
    expect(mockCallback.mock.calls[1]).toEqual([props.facets[randomCheckboxIndex].group, []])
  })

  test(`matches snapshot`, () => {
    const tree = renderer.create(<CheckboxFacetGroup {...props} facets={vindicators}/>).toJSON()
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
    while (props.facets.length === 0) {
      props.facets = vindicators.filter(() => Math.random() > 0.5)
    }
  })

  test(`callback includes facet name in arguments`, () => {
    const mockCallback = jest.fn()
    const wrapper = mount(<MultiselectDropdownFacetGroup {...props} onChange={mockCallback} />)
    wrapper.find(Select).instance().onChange()
    expect(mockCallback.mock.calls.length).toBe(1)
    expect(mockCallback.mock.calls[0][0]).toEqual(props.facetGroupName)
  })

})
