import React from 'react'
import Enzyme from 'enzyme'
import {shallow} from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import { data } from './TestUtils'
import TableFooter from '../src/TableFooter'

Enzyme.configure({ adapter: new Adapter() })

describe(`TableFooter`, () => {
  const props = {
    dataArrayLength: Math.random() * 10,
    entriesPerPage: 1,
    selectedNumber: 2,
    dataLength:  data.length,
    currentPage: 1,
    onChange: () => {}
  }

  test(`should render a previous button, a next button and information text`, () => {
    const wrapper = shallow(<TableFooter {...props}/>)
    expect(wrapper.find(`li`).first().key()).toBe(`previous`)
    expect(wrapper.find(`li`).last().key()).toBe(`next`)
  })

})
