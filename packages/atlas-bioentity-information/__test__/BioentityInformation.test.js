import React from 'react'
import { shallow } from 'enzyme'
import renderer from 'react-test-renderer'

import randomString from 'random-string'

import BioentityInformation from '../src/BioentityInformation'
import { bioentityProperties } from './brca2-bioentity-information.json'

describe(`BioentityInformation`, () => {
  test(`accepts a class name that’s applied to the top level <div>`, () => {
    const randomClassName = randomString()
    const wrapper = shallow(<BioentityInformation bioentityProperties={[]} className={randomClassName}/>)
    expect(wrapper).toHaveClassName(randomClassName)
  })

  test(`matches snapshot`, () => {
    const tree = renderer.create(<BioentityInformation bioentityProperties={bioentityProperties}/>).toJSON()
    expect(tree).toMatchSnapshot()
  })
})
