import React from 'react'
import renderer from 'react-test-renderer'
import Enzyme from 'enzyme'
import {shallow, mount} from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

import BioentityProperty from '../src/BioentityProperty'
import {mockBioentityProperties} from './Utils'

Enzyme.configure({ adapter: new Adapter() })

describe(`BioentityProperty`, () => {
  test(`with data matches snapshot`, () => {
    const bioentityProperty = mockBioentityProperties()[0]
    const tree = renderer.create(<BioentityProperty type={bioentityProperty.type} name={bioentityProperty.name} values={bioentityProperty.values}/>).toJSON()

    expect(tree).toMatchSnapshot()
  })

  test(`showMore button is not shown for other properties except gene ontology`, () => {
    const bioentityPropertyWithShowMore = mockBioentityProperties()[0]
    const bioentityPropertyWithoutShowMore = mockBioentityProperties()[1]

    const wrapperWithButton = mount(<BioentityProperty type={bioentityPropertyWithShowMore.type} name={bioentityPropertyWithShowMore.name} values={bioentityPropertyWithShowMore.values}/>)
    expect(wrapperWithButton.find(`a`).find({role: `button`}).exists()).toBe(true)

    const wrapperWithouButton = mount(<BioentityProperty type={bioentityPropertyWithoutShowMore.type} name={bioentityPropertyWithoutShowMore.name} values={bioentityPropertyWithoutShowMore.values}/>)
    expect(wrapperWithouButton.find(`a`).find({role: `button`}).exists()).toBe(false)
  })

  test(`the number of links increases when showMore is clicked`, () => {
    const bioentityProperty = mockBioentityProperties()[0]

    const wrapper = mount(<BioentityProperty type={bioentityProperty.type} name={bioentityProperty.name} values={bioentityProperty.values}/>)

    // Dummy data has more than 3 values so maximum 3 should always be displayed
    expect(wrapper.find(`.bioEntityCardLink`)).toHaveLength(3)

    // Simulate button click
    wrapper.find(`a`).find({role: `button`}).simulate('click')

    expect(wrapper.find(`.bioEntityCardLink`)).toHaveLength(bioentityProperty.values.length)
  })

  test(`properties without URLs are displayed as text`, () => {
    const bioentityProperty = mockBioentityProperties()[1]

    const wrapper = mount(<BioentityProperty type={bioentityProperty.type} name={bioentityProperty.name} values={bioentityProperty.values}/>)

    expect(wrapper.find(`.bioentityCardLink`).exists()).toBe(false)
  })

})