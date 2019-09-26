import React from 'react'
import {shallow} from 'enzyme'
import { data, getRandomInt } from './TestUtils'
import TableFooter from '../src/TableFooter'

describe(`TableFooter`, () => {
  const props = {
    dataArrayLength: getRandomInt(1, 7),
    entriesPerPage: 1,
    selectedNumber: 2,
    dataLength:  data.length,
    currentPage: 1,
    onChange: () => {},
    currentPageDataLength: 1
  }

  test(`should render a previous button, a next button and information text`, () => {
    const wrapper = shallow(<TableFooter {...props}/>)
    expect(wrapper.find(`li`).first().key()).toBe(`previous`)
    expect(wrapper.find(`li`).last().key()).toBe(`next`)
  })

  //pagination with front and back dots
  test(`should have dots inserted if current page is a middle one among more than 6 pages`, () => {
    const largeTableProps = {
      dataArrayLength: 23,
      entriesPerPage: 1,
      selectedNumber: 1,
      dataLength:  16,
      currentPage: 18,
      onChange: () => {},
      currentPageDataLength: 1
    }
    const wrapper = shallow(<TableFooter {...largeTableProps}/>)
    //pages should be: previous, 1, ..., 17, 18(current), 19, ..., 23, next
    expect(wrapper.find(`li`).length).toBe(9)
    //buttons: previous, 1, 17, 19, 23, next
    expect(wrapper.find(`li a`).length).toBe(6)

    const wrapper2 = shallow(<TableFooter {...largeTableProps} currentPage={2}/>)
    //pages: previous, 1 ,2(current), 3, 4, 5, ..., 23, next
    expect(wrapper2.find(`li`).length).toBe(9)
    //buttons: previous, 1, 3, 4, 5, 23, next
    expect(wrapper2.find(`li a`).length).toBe(7)

    const wrapper3= shallow(<TableFooter {...largeTableProps} currentPage={22}/>)
    //pages: previous, 1 ,19, 20, 21, 22(current), 23, next
    expect(wrapper3.find(`li`).length).toBe(9)
    //buttons: previous, 1, 19, 20, 21, 23, next
    expect(wrapper3.find(`li a`).length).toBe(7)
  })


  test(`should not have dots if pages are less than or equal to 6`, () => {
    const wrapper = shallow(<TableFooter {...props}/>)
    //maximum pages: previous, 1, 2, 3, 4, 5, 6, next
    expect(wrapper.find(`li a`).length).toBeLessThanOrEqual(props.dataArrayLength + 1)
    const wrapper2 = shallow(<TableFooter {...props} dataArrayLength={6} currentPage={3}/>)
    expect(wrapper2.find(`li a`).length).toBe(7)
    const wrapper3 = shallow(<TableFooter {...props} dataArrayLength={6} currentPage={1}/>)
    expect(wrapper3.find(`li a`).length).toBe(6)
  })

})
