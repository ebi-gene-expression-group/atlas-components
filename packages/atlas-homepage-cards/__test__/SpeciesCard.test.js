import React from 'react'
import renderer from 'react-test-renderer'
import Enzyme from 'enzyme'
import {shallow, mount, render} from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

import SpeciesCard from '../src/SpeciesCard.js'

Enzyme.configure({ adapter: new Adapter() })

describe(`SpeciesCard`, () => {
  test(`matches snapshot`, () => {
    const tree = renderer.create(<SpeciesCard />).toJSON()
    expect(tree).toMatchSnapshot()
  })
})
