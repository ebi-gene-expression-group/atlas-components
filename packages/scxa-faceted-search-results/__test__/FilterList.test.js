import React from 'react'
import renderer from 'react-test-renderer'
import Enzyme from 'enzyme'
import {mount} from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

import {episodes} from './TestUtils'

import FilterList from '../src/FilterList'

Enzyme.configure({ adapter: new Adapter() })

const props = {

}

describe(`FilterList`, () => {
  test(`Foo`, () => {
    //
  }),

  test(`matches snapshot`, () => {
    // const tree = renderer.create(<FilterList {...props}/>).toJSON()
    // expect(tree).toMatchSnapshot()
  })
})
