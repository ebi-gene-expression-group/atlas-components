import React from 'react'
import {shallow} from 'enzyme'
import { data } from './TestUtils'
import TableFooter from '../src/TableFooter'

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
